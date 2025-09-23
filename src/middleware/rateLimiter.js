/**
 * Middleware de rate limiting
 * Implementa limitação de requisições por IP
 */
const requestCounts = new Map();
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutos
const MAX_REQUESTS = 100; // Máximo de requisições por janela

export const rateLimiter = (request, h) => {
  const clientIP = request.info.remoteAddress;
  const now = Date.now();

  // Limpar entradas antigas
  for (const [ip, data] of requestCounts.entries()) {
    if (now - data.firstRequest > WINDOW_SIZE) {
      requestCounts.delete(ip);
    }
  }

  // Verificar limite para o IP atual
  const clientData = requestCounts.get(clientIP);

  if (!clientData) {
    // Primeira requisição do IP
    requestCounts.set(clientIP, {
      count: 1,
      firstRequest: now
    });
    return h.continue;
  }

  if (now - clientData.firstRequest > WINDOW_SIZE) {
    // Reset da janela de tempo
    requestCounts.set(clientIP, {
      count: 1,
      firstRequest: now
    });
    return h.continue;
  }

  if (clientData.count >= MAX_REQUESTS) {
    // Limite excedido
    const resetTime = new Date(clientData.firstRequest + WINDOW_SIZE);

    return h.response({
      success: false,
      message: 'Muitas requisições. Tente novamente mais tarde.',
      retryAfter: Math.ceil((clientData.firstRequest + WINDOW_SIZE - now) / 1000)
    }).code(429).header('Retry-After', Math.ceil((clientData.firstRequest + WINDOW_SIZE - now) / 1000));
  }

  // Incrementar contador
  clientData.count++;
  requestCounts.set(clientIP, clientData);

  return h.continue;
};
