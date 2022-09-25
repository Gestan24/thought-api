const { Thought } = require('../models/');

const thoughtController = {

    getAllThought(req, res) {

        Thought.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {

            console.log(err);

            res.status(400).json(err);

        });

    },

    getThoughtById({ params }, res) {

        Thought.findOne({ _id: params.id })
        .select('-__v')
        .then(dbThoughtData => {

            if (!dbThoughtData) {

                res.status(404).json({ message: 'No thought found with that id!'})

                return;

            }

            res.json(dbThoughtData);

        })
        .catch(err => {

            console.log(err);

            res.status(400).json(err);

        });

    },

    addThought({ params, body }, res) {

        thoughtController.create(body)
        .then(({ _id }) => {

            return User.findOneAndUpdate(

                { _id: params.UserId },
                { $push: { thoughts: _id }},
                { new: true }
                
            );
            
        })
        .then(dbUserData => {

            if (!dbUserData) {

                res.status(404).json({ message: 'No User found with that id!'})

                return;

            }

            res.json(dbUserData);

        })

        .catch(err => res.json(err));

    },

    addReaction({ params, body}, res) {

        Thought.findOneAndUpdate(

            { _id: params.thoughtId },
            { $push: { replies: body }},
            { new: true, runValidators: true }

        )
        .then(dbUserData => {

            if (!dbUserData) {

                res.status(404).json({ message: 'No user found with that id!'})

                return;

            }

            res.json(dbUserData);

        })

        .catch(err => res.json(err));

    },

    updateThought({ params, body }, res) {

        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbThoughtData => {

            if (!dbThoughtData) {

                res.status(404).json({ message: 'No thought found with that id!'});

                return;

            }

            res.json(dbThoughtData);

        })
        .catch(err => res.status(400).json(err));

    },

    deleteThought({ params }, res) {

        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {

            if (!dbThoughtData) {

                res.status(404).json({ message: 'No thoughts found with that id!'})

                return;

            }

            res.json(dbThoughtData);

        })

        .catch(err => res.status(400).json(err));

    },

    removeReaction({ params }, res) {

        Thought.findOneAndDelete(

            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId}}},
            { new: true }

        )
        .then(dbUserData => res.json(dbUserData))

        .catch(err => res.json(err));
        
    }

};


module.exports = thoughtController;