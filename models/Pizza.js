//import the dependencies. ONLY Schema constructor, model function ( rather than entire lib)
const { Schema, model } = require('mongoose');
const moment = require('moment');

const PizzaSchema = new Schema({
  pizzaName: {
    type: String,
    //required: 'You need to provide a pizza name'
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    //converts before it gets to the controller
    get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
  },
  size: {
    type: String,
    required: true,
    //enumerable = data can be iterated over
    enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
    default: 'Large'
  },
  toppings: [],
  comments: [
    {
      type: Schema.Types.ObjectId,
      //tells Pizza model which documents to search for to find the right comments
      ref: 'Comment'
    }
  ]
},
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
  //.reduce( accumulator, currentValue ) method used to tally total of every comment with its replies
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});


// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;