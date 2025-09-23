/**
 * Middleware de tratamento de erros global
 * Padroniza respostas de erro da API
 */
export const errorHandler = (request, h) => {
  const response = request.response;

  // Se não é um erro, continua normalmente
  if (!response.isBoom) {
    return h.continue;
  }

  const { statusCode, message } = response.output.payload;

  // Log do erro para monitoramento
  console.error('Erro na API:', {
    method: request.method,
    path: request.path,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    userAgent: request.headers['user-agent'],
    ip: request.info.remoteAddress
  });

  // Resposta padronizada de erro
  const errorResponse = {
    success: false,
    message: message || 'Erro interno do servidor',
    statusCode,
    timestamp: new Date().toISOString(),
    path: request.path,
    method: request.method
  };

  // Adicionar detalhes do erro apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = response.stack;
    errorResponse.details = response.data;
  }

  return h.response(errorResponse).code(statusCode);
};
