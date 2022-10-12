function getNextSequenceValue(sequenceName) {
  var sequenceDocument = db.counters.findAndModify({
    query: { _id: sequenceName },
    update: { $inc: { sequence_value: 1 } },
    new: true,
  });
  return sequenceDocument.sequence_value;
}
