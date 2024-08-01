const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async getReplies(commentId) {
    const query = {
      text: `SELECT r.id, r.content, r.updated_at, r.owner, r.is_delete, u.username
            FROM replies as r
            INNER JOIN users as u ON r.owner = u.id
            WHERE comment = $1
            ORDER BY r.updated_at ASC`,
      values: [commentId],
    };

    return this._pool.query(query);
  }

  async addReply(addReply, commentId, owner) {
    const id = `reply-${this._idGenerator()}`;
    const { content } = addReply;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO replies(id, content, comment, owner, created_at, updated_at) 
            VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner`,
      values: [id, content, commentId, owner, createdAt, createdAt],
    };

    return this._pool.query(query);
  }

  async verifyReplyOwner(ownerId, replyId) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [replyId],
    };

    return this._pool.query(query);
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = TRUE WHERE id = $1',
      values: [replyId],
    };

    return this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
