const { User, List, Item } = require('../database/models')
const { createItemSchema, updateItemSchema } = require('../validations/itemValidation')
const { getListNumItems } = require('./listController')

const getListItems = async (req, res) => {

    try {

        const listId = req.params.listId
        const userId = req.session.userId

        let list = await List.findByPk(listId)
        
        if(!list)
            return res.status(404).redirect('/home')

        let hasNotes = true
        if(!list.notes) {
            hasNotes = false
        }

        let numItems = await getListNumItems(listId)
        let hasItems = true
        if(numItems === 0) {
            hasItems = false
        }

        if(list.userId != userId)
            return res.status(404).redirect('/home')

        
        let items = await Item.findAll({where: {listId: listId}})
        res.render('items', { 
            listId,
            list: list.toJSON(),
            items: items.map(item => ({...item.toJSON(), listId})),
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
        const userId = req.session.userId

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

const getCreateItemForm = async (req, res) => {

    try {

        const listId = req.params.listId
        const userId = req.session.userId

        const list = await List.findByPk(listId)

        if(!list) {
            res.status(404).redirect('/home')
        }

        if(list.userId !== userId) {
            res.status(403).redirect('/home')
        }
        
        res.render('addItem', {
            listId: list.id,
            listName: list.name,
            error: false
        })

    } catch(err) {
        res.status(500).json({error: "Internal server error"})
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
        const userId = req.session.userId

        const list = await List.findByPk(listId)

        if(!list) {
            res.status(404).redirect('/home')
        }

        if(list.userId !== userId) {
            res.status(403).redirect('/home')
        }

        let hasNotes = true
        if(!list.notes) {
            hasNotes = false
        }


        const createdItem = await Item.create({listId: listId, name: req.body.name})
        res.redirect(`/lists/${listId}/items`)
        
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
        const userId = req.session.userId

        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).redirect('/home')

        if(list.userId != userId)
            return res.status(403).redirect('/home')


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
        const userId = req.session.userId
        
        const list = await List.findByPk(listId)

        if(!list)
            return res.status(404).redirect('/home')

        if(list.userId != userId)
            return res.status(403).redirect('/home')


        const item = await Item.findByPk(id)

        if(!item)
            res.status(404).json({error: `Item with id:${id} not found`})

        if(item.listId != listId)
            return res.status(404).json({error: `Item with id:${id} not found in list with id:${listId}`})

        await Item.destroy({where: {id: id}})
        res.redirect(`/lists/${listId}/items`)
   
    } catch(err) {
        res.status(500).json({error: 'Error deleting item'})
    }
}

module.exports = {
    getListItems,
    getListItemById,
    getCreateItemForm,
    createListItem,
    updateListItemById,
    deleteListItemById
}