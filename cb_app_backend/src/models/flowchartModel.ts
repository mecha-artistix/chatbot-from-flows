import mongoose, { Schema } from 'mongoose';
// const { LinkedNodes, makeConnectionsObj, generateModel } = require('./generatePromptString');

// const Bot = require('@/bots/botModel');
import User from './usersModel';
import { INode, IEdge, IFlowChart } from '../types/flowchart';

const nodeSchema = new Schema<INode>({
  type: { type: String },
  position: {
    x: { type: Number },
    y: { type: Number },
  },
  data: { type: Schema.Types.Mixed },
  width: { type: Number },
  height: { type: Number },
  id: { type: String, required: true },
  parent: { type: String },
  draggable: { type: Boolean },
});

const edgeSchema = new Schema<IEdge>({
  source: { type: String, required: true },
  sourceHandle: { type: String },
  target: { type: String, required: true },
  targetHandle: { type: String },
  type: { type: String },
  data: { type: Schema.Types.Mixed },
  style: { type: Schema.Types.Mixed },
  markerEnd: { type: Schema.Types.Mixed },
  id: { type: String, required: true },
});

const flowChartSchema = new Schema<IFlowChart>({
  name: {
    type: String,

    required: [true, 'Please Provide a valid name for flowchart'],
    match: [/^[a-zA-Z][a-zA-Z0-9]*$/, 'Name must start with a letter and contain only alphanumeric characters'],
  },
  createdAt: { type: Date, default: Date.now },
  nodes: [nodeSchema],
  edges: [edgeSchema],
  // promptText: { type: String },
  bot: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

flowChartSchema.post('save', async function (doc) {
  await User.findOneAndUpdate({ _id: doc.user }, { $addToSet: { flowcharts: doc._id } }, { new: true, upsert: true });
});

// Create a compound index to enforce uniqueness on name per user
flowChartSchema.index({ user: 1, name: 1 }, { unique: true, background: true });
// flowChartSchema.statics.checkIfFlowchartExist = checkIfNameExists();

// flowChartSchema.statics.checkIfFlowchartExist = async function (
//   userId: mongoose.Schema.Types.ObjectId,
//   name: string,
// ): Promise<boolean> {
//   const count = await this.countDocuments({ user: userId, name });
//   return count > 0;
// };

// Post-save middleware
flowChartSchema.post<IFlowChart>('save', async function (doc) {
  try {
    // Ensure `doc.user` and `doc._id` are of the correct type
    await User.findOneAndUpdate({ _id: doc.user }, { $addToSet: { flowcharts: doc._id } }, { new: true, upsert: true });
  } catch (error) {
    // Handle potential errors here
    console.error('Error updating User with new flowchart:', error);
  }
});

const Flowchart = mongoose.model<IFlowChart>('Flowchart', flowChartSchema);

export default Flowchart;

// Middleware to fetch the document before update

// flowChartSchema.post('findOneAndUpdate', async function (doc, next) {});

// flowChartSchema.post('findOneAndUpdate', async function (doc, next) {
//   // console.log('opt \n', this.getOptions().cotext.userId);
//   console.log('doc');
//   if (doc) {
//     try {
//       const { name, nodes, edges, user, _id } = doc;
//       // console.log(nodes, edges);
//       // Generate promptText
//       const promptList = new LinkedNodes();
//       makeConnectionsObj(promptList, nodes, edges);
//       const promptConnectedList = promptList.getTree();
//       const promptText = generateModel(promptConnectedList);

//       const botData = { user, name, prompt: { promptText, source: _id } };
//       const bot = await Bot.findOneAndUpdate({ user, name }, { $set: botData }, { new: true, upsert: true });

//       if (bot && bot._id) {
//         await Flowchart.updateOne({ _id: doc._id }, { $set: { bot: bot._id } });
//         // await UserProfile.findOneAndUpdate({ user }, { $addToSet: { bots: bot._id } }, { new: true, upsert: true });
//         await User.findOneAndUpdate(
//           { _id: user },
//           { $addToSet: { flowcharts: _id, bots: bot._id } },
//           { new: true, upsert: true }
//         );
//       }
//     } catch (error) {
//       console.error('Error updating bot:', error);
//     }
//   }
//   next();
// });
