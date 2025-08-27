const { User, List, Item } = require('../database/models')
const { createItemSchema, updateItemSchema } = require('../validations/itemValidation')
const { getListNumItems } = require('./listController')

const getListItems = async (req, res) => {

    try {

        const listId = req.params.listId

        let list = await List.findByPk(listId)
        
        if(!list)
            return res.status(404).json({error: `List with id:${listId} not found`})

        let hasNotes = true
        if(!list.notes) {
            hasNotes = false
        }

        let numItems = await getListNumItems(listId)
        let hasItems = true
        if(numItems === 0) {
            hasItems = false
        }



        // if(list.userId != userId)
        //     return res.status(403).json({error: "You don't have permission to acces this list"})

        
        let items = await Item.findAll({where: {listId: listId}})
        res.render('items', { 
            list: list.toJSON(),
            items: items.map(item => item.toJSON()),
            hasNotes,
            hasItems
        })


    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Error getting list items'})
    }
}

const getListItemById = async (req, res) => {

    try {

        const { id, listId }  = req.params
        const userId = req.user.userId

        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).json({error: `List with id:${listId} not found`})

        if(list.userId != userId)
            return res.status(403).json({error: "You don't have permission to acces this list"})


        const foundItem = await Item.findByPk(id)

        if(!foundItem)
            return res.status(404).json({error: `Item with id:${id} not found`})

        if(foundItem.listId != listId)
            return res.status(404).json({error: `Item with id:${id} not found in list with id:${listId}`})

        res.status(200).json(foundItem)

    } catch(err) {
        res.status(500).json({error: 'Error getting list item'})
    }
}

const createListItem = async (req, res) => {    

    const { error, value } = createItemSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).json({ 
            'Invalid fields': error.details.map(e => e.message)
        })
    }

    try {
        const listId = req.params.listId
        const userId = req.user.userId

        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).json({error: `List with id:${listId} not found`})

        if(list.userId != userId)
            return res.status(403).json({error: "You don't have permission to acces this list"})

        const createdItem = await Item.create({listId: listId, name: req.body.name})
        res.status(201).json({message: `Item created succesfully in the list with id:${listId}`, item: createdItem})
        
    } catch(err) {
        res.status(500).json({error: 'Error creating item'})
    }
}

const updateListItemById = async (req, res) => {

    const { error, value } = updateItemSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).json({ 
            'Invalid fields': error.details.map(e => e.message)
        })
    }

    try {

        const { id, listId } = req.params
        const userId = req.user.userId

        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).json({error: `List with id:${listId} not found`})

        if(list.userId != userId)
            return res.status(403).json({error: "You don't have permission to acces this list"})


        const item = await Item.findByPk(id)

        if(!item)
            res.status(404).json({error: `Item with id:${id} not found`})

        if(item.listId != listId)
            return res.status(404).json({error: `Item with id:${id} not found in list with id:${listId}`})

        const updatedItem = await item.update(value)
        res.status(200).json({message: 'Item updated succesfully', 'Updated Item': updatedItem})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Error updating item'})
    }
}

const deleteListItemById = async (req, res) => {

    try {

        const { id, listId } = req.params
        const userId = req.user.userId
        
        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).json({error: `List with id:${listId} not found`})

        if(list.userId != userId)
            return res.status(403).json({error: "You don't have permission to acces this list"})


        const item = await Item.findByPk(id)

        if(!item)
            res.status(404).json({error: `Item with id:${id} not found`})

        if(item.listId != listId)
            return res.status(404).json({error: `Item with id:${id} not found in list with id:${listId}`})

        await Item.destroy({where: {id: id}})
        res.status(200).json({message: `Item with id:${id} deleted successfully`})
   
    } catch(err) {
        res.status(500).json({error: 'Error deleting item'})
    }
}

module.exports = {
    getListItems,
    getListItemById,
    createListItem,
    updateListItemById,
    deleteListItemById
}