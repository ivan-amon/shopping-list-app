const { User, List } = require('../database/models')

const createList = async (req, res) => {

    try {
        const userId = req.user.userId
        const { name, notes, date, isCompleted } = req.body
        const createdList = await List.create({ userId, name, notes, date, isCompleted })

        res.status(201).json({message: 'List created successfully', list: createdList})

    } catch(err) {
        res.status(500).json({error: 'Error creating list'})
    }
}

const getUserLists = async (req, res) => {

    try {
        const user = await User.findByPk(req.user.userId)
        const userLists = await List.findAll({where: {userId: user.id}})

        res.status(200).json(userLists)

    } catch(err) {

        res.status(500).json({error: 'Error fetching lists'})
    }
}

module.exports = { createList, getUserLists }