import { PrismaClient } from '@prisma/client';

export class PrismaStrategy {
  constructor(client = new PrismaClient()) {
    this.client = client;
  }

  async isConnected() {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch (_) {
      return false;
    }
  }

  async create(data) {
    const user = await this.client.user.create({ data });
    const { password, ...rest } = user;
    return { success: true, data: rest, message: 'Usuário criado com sucesso' };
  }

  async read(query = {}) {
    const users = await this.client.user.findMany({ where: query });
    const sanitized = users.map((u) => {
      const { password, ...rest } = u;
      return rest;
    });
    return { success: true, data: sanitized, message: 'Usuários encontrados com sucesso' };
  }

  async findById(id) {
    const user = await this.client.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, nome: true, email: true, role: true, status: true, ultimoLogin: true }
    });
    if (!user) return { success: false, message: 'Usuário não encontrado' };
    return { success: true, data: user, message: 'Usuário encontrado com sucesso' };
  }

  async findByEmail(email) {
    const user = await this.client.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return { success: false, message: 'Usuário não encontrado' };
    return { success: true, data: user, message: 'Usuário encontrado com sucesso' };
  }

  async update(id, data) {
    try {
      const user = await this.client.user.update({
        where: { id: Number(id) },
        data
      });
      const { password, ...rest } = user;
      return { success: true, data: rest, message: 'Usuário atualizado com sucesso' };
    } catch (error) {
      if (error?.code === 'P2025') {
        return { success: false, message: 'Usuário não encontrado' };
      }
      throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      await this.client.user.delete({ where: { id: Number(id) } });
      return { success: true, message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error?.code === 'P2025') {
        return { success: false, message: 'Usuário não encontrado' };
      }
      throw new Error(`Erro ao remover usuário: ${error.message}`);
    }
  }
}
