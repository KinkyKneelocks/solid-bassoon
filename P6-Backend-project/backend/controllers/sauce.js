const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { json } = require('express');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then((sauces) => {
        res.status(200).json(sauces);
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then((sauce) => {
        res.status(200).json(sauce);
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
};

exports.addSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');

    const sauce = new Sauce({
        userId: req.body.sauce.userId,
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
      });

      sauce.save().then(
          () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
              });
          }
      ).catch((error) => {
        res.status(400).json({
            error: error
          });
      })
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
      (thing) => {
        const filename = thing.imageUrl.split('/images/')[1];
        fs.unlink('images/' + filename, () => {
          Sauce.deleteOne({_id: req.params.id}).then(
            () => {
              res.status(200).json({
                message: 'Deleted!'
              });
            }
          ).catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
        });
      }
    );
  };

  exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({_id: req.params._id});
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename
        };
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            heat: req.body.heat,
            mainPepper: req.body.mainPepper,
        };
    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(201).json({
                message: 'Updated successfully'
            })
        }
    ).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
  };

  exports.rateSauce = (req, res, next) => {
    if (req.body.like == 1) {
        Sauce.updateOne({_id: req.params.id},{
            $addToSet: {usersLiked: req.body.userId},
            $inc: {likes: 1}
        }).then(() => {
            res.status(201).json({
                message: 'updated successfully'
            })
        }).catch((error) => {
            res.status(400).json({
                error: error
            })
        });
    }

    if (req.body.like == -1) {
        Sauce.updateOne({_id: req.params.id},{
            $addToSet: {usersDisliked: req.body.userId},
            $inc: {dislikes: 1}
        }).then(() => {
            res.status(201).json({
                message: 'updated successfully'
            })
        }).catch((error) => {
            res.status(400).json({
                error: error
            })
        });
    }

    if (req.body.like == 0) {
        Sauce.findOne({_id: req.params.id}).then((sauce) => {
        let x = false;
        for (i = 0; i > sauce.usersLiked.length; i++) {
            if (sauce.usersLiked[i] == req.body.userId){
                x = true;
            }
        }
        if (x === true) {
            Sauce.updateOne({_id: req.params.id},{
                $pull: {usersLiked: req.body.userId},
                $inc: {likes: -1}
            }).then(() => {
                res.status(201).json({
                    message: 'updated successfully'
                })
            }).catch((error) => {
                res.status(400).json({
                    error: error
                })
            });
        } else {
            Sauce.updateOne({_id: req.params.id},{
                $pull: {usersDisliked: req.body.userId},
                $inc: {dislikes: -1}
            }).then(() => {
                res.status(201).json({
                    message: 'updated successfully'
                })
            }).catch((error) => {
                res.status(400).json({
                    error: error
                })
            });
        }
    
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    });
    }

    };

