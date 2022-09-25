const router = require('express').Router();

const {

    getAllThought,
    getThoughtById,
    addThought,
    addReaction,
    updateThought,
    deleteThought,
    removeReaction

} = require('../../controllers/thought-controller');


router

.route('/')
.get(getAllThought)
.post(addThought)


router

.route('/:id')
.get(getThoughtById)
.put(updateThought)
.delete(deleteThought)


router.route('/:thoughtId/reactions')

.post(addReaction)
.delete(removeReaction);


module.exports = router;