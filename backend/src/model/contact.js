import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  online:{
    type:Boolean,
    require:false,
  }
});

export default mongoose.model("Contact", contactSchema);
