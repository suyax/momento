var sequelize = require('../db/dbModel').sequelize;
var Promise = require('bluebird');
var stories = require('../db/dbModel').Story;
var moments = require('../db/dbModel').Moment;
var tags = require('../db/dbModel').Tag;
var tags_moments = require('../db/dbModel').Tags_Moments;


module.exports = {

  add: function (tagData) {
    var momentId = tagData.momentId; 
    var arrOfTagObjs = tagData.tags.map(function(tagName){
      return {name: tagName};
    });

    return sequelize.transaction(function (t) {
      return tags.bulkCreate(
        arrOfTagObjs
        ,{returning: true} 
        ,{transaction: t})
        .then(function(addedTags){
          var arrOfTagIds = addedTags.map(function(tagObj){
            return tagObj.dataValues.id;
          });
          var tagMomentObjArr = arrOfTagIds.map(function(tagId){
            return {momentId: momentId, tagId: tagId};
          });
          return tags_moments.bulkCreate(
            tagMomentObjArr
            ,{transaction: t});
        })
        .catch(function(err){
          console.error("Error adding tags: ", err);
        });
    });
  },

  getAllByMoment: function (momentId) {
    return tags.findAll({
      attributes: ['name'],
      include: [{
        model: moments,
        where: {
          id: momentId
        }
      }]
    })
    .then(function (result) {
      var arrayOfTagNames = result.map(function (tagObj) {
        return tagObj.dataValues.name;
      });
      return arrayOfTagNames;
    })
    .catch(function (error) {
      console.error('Error getting tags by Moment:' , error);
    })
  },

  getAllByStory: function (storyId) {
    return tags.findAll({
      attributes: ['name'],
      include: [{
        model: moments,
        include: [{
          model: stories,
          where: {id: storyId}
        }]
      }]
    })
    .then(function(result){
      return arrayOfTagNames = result.map(function (tagObj) {
        return tagObj.dataValues['name'];
      });
    })
    .catch(function(error){
      console.error('Error getting tags by Story: ', error);
    })
  }
};
