const { User } = require('../models');

const userController = {

    getAllUser(req, res) {

        User.find({})
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });

    },

    getUserById({ params }, res) {

        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbUserData => {

            if (!dbUserData) {

                res.status(404).json({ message: 'No User found with that id!'});
                
                return;

            }

            res.json(dbUserData);

        }).catch(err => {

            console.log(err);

            res.status(400).json(err);

        });

    },

    createUser({ body }, res) {

        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(404).json(err));

    },

    addFriend({ params }, res) {

        User.findOneAndUpdate(

            { _id: params.userId },
            { $push: { friends: params.friendId }},
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

    updateUser({ params, body }, res) {

        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {

            if (!dbUserData) {

                res.status(404).json({ message: 'No user found with that id!'})

            }
            res.json(dbUserData);

        })
        .catch(err => res.status(400).json(err));

    },

    deleteUser({ params }, res) {

        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {

            if (!dbUserData) {

                res.status(404).json({ message: 'No user found with that id!'})

                return;

            }

            res.json(dbUserData);

        })

        .catch(err => res.status(404).json(err));

    },

    removefriend({ params }, res) {

        User.findOneAndUpdate(

            { _id: params.userId },
            { $pull: { friends: { friendId: params.friendId }}},
            { new: true }

        )

        .then(dbUserData => res.json(dbUserData))

        .catch(err => res.json(err));

    }

};

module.exports = userController;
