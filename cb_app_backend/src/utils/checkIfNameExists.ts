import mongoose, { Document, Model as MongooseModel } from 'mongoose';

/**
 * Checks if a document with the given name exists in the specified model.
 * @param Model - Mongoose model to query.
 * @param name - Name to check for existence.
 * @param field - Field name to check for the existence.
 * @param userId - Optional user ID to filter by user (if applicable).
 */

type CheckIfNameExists = (
  this: MongooseModel<IFlowChart>,
  userId: mongoose.Schema.Types.ObjectId,
  name: string,
) => Promise<boolean>;

export const checkIfNameExists: CheckIfNameExists = async <T extends Document>(
  Model,
  name,
  userId,
): Promise<boolean> => {
  const query: any = { [field]: name };
  if (userId) query.user = userId;

  const count = await Model.countDocuments(query);
  return count > 0;
};

// type CheckIfNameExists = (userId: mongoose.Schema.Types.ObjectId, name: string) => Promise<boolean>;

// export const checkIfNameExists: CheckIfNameExists = async () => {
//   const count = await this.countDocuments({ user: userId, name });
//   return count > 0;
// };
