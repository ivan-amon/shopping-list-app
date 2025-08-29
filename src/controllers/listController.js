const { where, QueryTypes } = require('sequelize')
const { User, List, Item, sequelize } = require('../database/models')
const { createListSchema, updateListSchema} = require('../validations/listValidation')
const { injectReplacements } = require('sequelize/lib/utils/sql')


const createList = async (req, res) => {

    const { error, value } = createListSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).render('addList', {
            error: true,
            validationError: error.details.map(e => e.message)
        })
    }

    try {

        const userId = req.session.userId;
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
        const userId = req.session.userId;

        const list = await List.findOne({where: {id: listId}})

        if(!list)
            return res.status(404).redirect('/home')

        if(list.userId != userId)
            return res.status(403).redirect('/home')

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

        const userId = req.session.userId

        const lists = await sequelize.query(`
            SELECT lists.* FROM users
            JOIN lists ON users.id = lists.userId
            WHERE users.id = :userId
        `, {
            replacements: { userId },
            type: QueryTypes.SELECT
        })

        let hasLists = lists.length > 0
        if(!lists) {
            hasLists = false
        }

        lists.forEach(async (list) => {
            list.date = list.date.toLocaleDateString('es-ES')
            list.numItems = await getListNumItems(list.id)
        })

        res.render('home', { lists, hasLists })

    } catch(err) {
        console.log(err)
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
        const userId = req.session.userId

        const list = await List.findOne({where: {id: listId}})

        if(!list)
            return res.status(404).redirect('/home')

        if(list.userId != userId)
            return res.status(403).redirect('/home')

        await List.destroy({where: { id: listId}})
        res.redirect('/home')

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Error deleting list'})
    }
}

const getCreateListForm = (req, res) => {
    res.render('addList')
}

const getListNumItems = async (listId) => {

    const [result, metadata] = await sequelize.query(`
        SELECT COUNT(items.id) AS numItems 
        FROM items JOIN lists ON items.listId = lists.id 
        WHERE lists.id = :listId
        GROUP BY items.listId
    `, {
        replacements: { listId }
    })
    return result[0]?.numItems ?? 0
}


module.exports = { 
    createList, 
    getUpdateListForm,
    getUserLists,
    updateList,
    deleteListById,
    getCreateListForm,
    getListNumItems
 }