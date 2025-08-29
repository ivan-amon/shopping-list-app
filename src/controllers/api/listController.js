const { User, List } = require('../../database/models')
const { createListSchema, updateListSchema } = require('../../validations/listValidation')

const createList = async (req, res) => {

  const { error, value } = createListSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({
      'Invalid fields': error.details.map(e => e.message)
    })
  }

  try {

    const userId = req.user.userId
    const { name, notes, date, isCompleted } = req.body
    const createdList = await List.create({ userId, name, notes, date, isCompleted })

    res.status(201).json({ message: 'List created successfully', list: createdList })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error creating list' })
  }
}

const updateList = async (req, res) => {

  const { error, value } = updateListSchema.validate(req.body, { abortEarly: false })
  if (error) {
    return res.status(400).json({
      'Invalid fields': error.details.map(e => e.message)
    })
  }

  try {

    const listId = req.params.id
    const userId = req.user.userId

    const list = await List.findOne({ where: { id: listId } })

    if (!list)
      return res.status(404).json({ message: `List with id:${listId} not found` })

    if (list.userId != userId)
      return res.status(403).json({ message: "You don't have permission to update this list" })

    const updatedList = await list.update(value)
    res.status(200).json({ message: 'List updated successfully', 'Updated List': updatedList })

  } catch (err) {
    res.status(500).json({ error: 'Error updating list' })
  }
}

const getUserLists = async (req, res) => {

  try {

    const user = await User.findByPk(req.user.userId)
    const userLists = await List.findAll({ where: { userId: user.id } })

    res.status(200).json(userLists)

  } catch (err) {

    res.status(500).json({ error: 'Error fetching lists' })
  }
}

const getUserListById = async (req, res) => {

  try {

    const listId = req.params.id
    const userId = req.user.userId
    const foundList = await List.findByPk(listId)

    if (!foundList)
      return res.status(404).json({ error: `List with id:${listId} not found` })

    if (foundList.userId != userId)
      return res.status(403).json({ error: "You don't have permission to acces on this list" })

    res.status(200).json(foundList)

  } catch (err) {
    res.status(500).json({ error: 'Error fetching list' })
  }
}

const deleteListById = async (req, res) => {

  try {

    const listId = req.params.id
    const userId = req.user.userId

    const list = await List.findOne({ where: { id: listId } })

    if (!list)
      return res.status(404).json({ message: `List with id:${listId} not found` })

    if (list.userId != userId)
      return res.status(403).json({ message: "You don't have permission to delete this list" })

    await List.destroy({ where: { id: listId } })
    res.status(200).json({ message: `List with id:${listId} deleted successfully` })

  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Error deleting list' })
  }
}

module.exports = {
  createList,
  updateList,
  getUserLists,
  getUserListById,
  deleteListById
}