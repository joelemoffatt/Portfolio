export function createNote(req, res) {
  res.status(200).send("You have 20 notes!");
}

export function getAllNotes(req, res) {
  res.status(201).json({ message: "You successfully created a note!" });
}

export function updateNote(req, res) {
  res.status(200).json({ message: "You successfully updated a note!" });
}

export function deleteNote(req, res) {
  res.status(200).json({ message: "You successfully deleted a note!" });
}