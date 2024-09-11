import mongoose, { Schema } from "mongoose";

const kvuser = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    picture: { type: String, require: true },
    tokenversion: { type: String, default: 1 },
    projects: [{ type: Schema.Types.ObjectId, ref: "kvproject" }],
});

const kvproject = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "kvuser" },
    projectName: { type: String, reqire: true },
    description: { type: String },
    keyvalue: [{ key: String, value: String }],
});

export const kvu = mongoose.models.kvuser || mongoose.model("kvuser", kvuser);
export const kvp =
    mongoose.models.kvproject || mongoose.model("kvproject", kvproject);
