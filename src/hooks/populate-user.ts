// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

export default (): Hook => {
  return async (context: HookContext) => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result, params } = context;

    // Function that adds the user to a single message object
    const addUser = async (message: any) => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const user = await app.service('users').get(message.userId, params);

      // Merge the message content to include the `user` object
      return {
        ...message, //listado de parametros almacenados en message
        user
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      context.result.data = await Promise.all(result.data.map(addUser));
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }
    // Promise.all se asegura de que todas las operaciones asincrónicas 
    // se completen antes de devolver todos los datos.

    // array.map(callback)
    // callback: Este parámetro es la función que produce 
    // un elemento del nuevo Array a partir de un elemento del actual.
    

    return context;
  };
}
