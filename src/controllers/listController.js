const { where } = require('sequelize')
const { User, List, Item, sequelize } = require('../database/models')
const { createListSchema, updateListSchema} = require('../validations/listValidation')

const createList = async (req, res) => {

    const { error, value } = createListSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).render('addList', {
            error: true,
            validationError: error.details.map(e => e.message)
        })
    }

    try {

        const userId = 1; //todo: change the userId to the client id
        const { name, notes, date, isCompleted } = req.body
        const createdList = await List.create({ userId, name, notes, date, isCompleted })

        res.redirect('/home')

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Internal server error'})
    }
}

const getUpdateListForm = async (req, res) => {
    
    try {

        const listId = req.params.id
        const userId = 1;

        const list = await List.findOne({where: {id: listId}})

        if(!list)
            return res.status(404).json({message: `List with id:${listId} not found`})

        // if(list.userId != userId)
        //     return res.status(403).json({message: "You don't have permission to update this list"})

        const dateISO = list.date ? new Date(list.date).toISOString().slice(0, 10) : '';

        res.render('editList', {
            id: list.id,
            name: list.name,
            date: dateISO,
            notes: list.notes,
            error: false
        })

    } catch(err) {
        res.status(500).json({error: 'Error updating list'})
    }
}

const getUserLists = async (req, res) => {

    try {

        const lists = await List.findAll()

        const formattedLists = lists.map(list => list.toJSON())
        formattedLists.forEach(async (list) => {
            list.date = list.date.toLocaleDateString('es-ES')
            list.numItems = await getListNumItems(list.id)
        })

        res.render('home', {
            lists: formattedLists
        })

    } catch(err) {
        console.log(err)
    }
}

const getUserListById = async (req, res) => {

    try {

        const listId = req.params.id
        const userId = req.user.userId
        const foundList = await List.findByPk(listId)

        if(!foundList)
            return res.status(404).json({error: `List with id:${listId} not found`})

        if(foundList.userId != userId)
            return res.status(403).json({error: "You don't have permission to acces on this list"})

        res.status(200).json(foundList)

    } catch(err) {
        res.status(500).json({error: 'Error fetching list'})
    }
}

const updateList = async (req, res) => {

    const { error, value } = createListSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).render('editList', {
            error: true,
            validationError: error.details.map(e => e.message)
        })
    }

    const listId = req.params.id
    const list = await List.findOne({where: {id: listId}})
    const updatedList = await list.update(value)
    res.redirect('/home')
}

const deleteListById = async (req, res) => {

    try {

        const listId = req.params.id

        const list = await List.findOne({where: {id: listId}})

        if(!list)
            return res.status(404).json({message: `List with id:${listId} not found`})

        // if(list.userId != userId)
        //     return res.status(403).json({message: "You don't have permission to delete this list"})

        await List.destroy({where: { id: listId}})
        res.redirect('/home')

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Error deleting list'})
    }
}

const getListNumItems = async (listId) => {

    const [result, metadata] = await sequelize.query(`
        SELECT COUNT(items.id) AS numItems 
        FROM items JOIN lists ON items.listId = lists.id 
        WHERE lists.id = ${listId}
        GROUP BY items.listId
    `)
    return result[0]?.numItems ?? 0
}

module.exports = { 
    createList, 
    getUpdateListForm,
    getUserLists,
    getUserListById,
    updateList,
    deleteListById,
    getListNumItems
 }