// Status simples em memória para demo
// Em produção, usar um banco de dados ou redis
const processingStatus = new Map();

export const updateStatus = (id, status) => {
  processingStatus.set(id, status);
};

export default async function handler(req, res) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Missing consultation ID' });
  }

  const status = processingStatus.get(id) || {
    status: 'not_found',
    progress: 0
  };

  return res.status(200).json(status);
}