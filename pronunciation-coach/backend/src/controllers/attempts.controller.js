import { prisma } from "../config/prisma.js";
 
export async function listAttempts(req, res, next) {
  try {
    const attempts = await prisma.attempt.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { createdAt: "desc" },
    });
    res.json(attempts);
  } catch (err) { next(err); }
}
 
export async function deleteAttempt(req, res, next) {
  try {
    await prisma.attempt.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) { next(err); }
}
 
export async function deleteAllForSession(req, res, next) {
  try {
    await prisma.attempt.deleteMany({ where: { sessionId: req.params.sessionId } });
    res.status(204).send();
  } catch (err) { next(err); }
}
