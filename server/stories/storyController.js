var storyModel = require('./storyModel');

module.exports =  {

  add: function (req, res){
  	var storyData = {
  	  title: req.body.title,
  	  description: req.body.description,
      //expecting an array of user ids
      existingUsersToInclude: req.body.existingUsers
      //eventually will want to do something with new users!!
  	};

  	storyModel.add(storyData)
  	  .then(function (results){
  	    res.status(201).json(results);
  	  })
  	  .catch(function (error){
  	    res.status(404).json();
  	  });
  },

  getOne: function (req, res) {
  	var storyId = req.params.storyId;
    storyModel.getOne(storyId)
      .then(function (result) {
        res.status(200).json(result);
      })
      .catch(function (error) {
        res.status(404).json();
      });
  },
  
  getAll: function (req, res) {
    storyModel.getAll()
      .then(function (results) {
        res.status(200).json(results);
      })
      .catch(function (error) {
        res.status(404).json();
      });
  }
};
