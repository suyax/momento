var storyModel = require('./storyModel');

module.exports =  {

  addStory: function (req, res){
  	var story = {
  	  title: req.body.title,
  	  description: req.body.description
  	};

  	storyModel.add(story)
  	  .then(function (results){
  	    res.status(201).send(results);
  	  })
  	  .catch(function (error){
  	    res.status(404).send();
  	  });
  },

  getOneStory: function (req, res) {
  	var storyId = req.params.storyId;
    storyModel.getOne(storyId)
      .then(function (result) {
        res.status(200).send(result);
      })
      .catch(function (error) {
        res.status(404).send();
      });
  },
  
  getAllStories: function (req, res) {
    storyModel.getAll()
      .then(function (results) {
        res.status(200).send(results);
      })
      .catch(function (error) {
        res.status(404).send();
      });
  }
};
