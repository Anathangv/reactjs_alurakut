import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequest(request, response){
    
    if (request.method === 'POST'){
        const TOKEN = '592260a2006ef8a483b72da23a1ba4';
        const client = new SiteClient(TOKEN);
    
        const registroCriado = await client.items.create({
            itemType: '1483986', // model ID on Dato > Models > [community] > Edit model
            ...request.body,
            // title: 'comunidade teste',
            // imageUrl: 'https://media.istockphoto.com/photos/spacex-falcon-9-starlink-l20-launch-picture-id1306530784?b=1&k=20&m=1306530784&s=170667a&w=0&h=_W1vBFBmOsCfDfca4ew6W2jbOicqVVv6NXBc9DjTJgk=',
            // creatorSlug: 'akira'
        })
         
        response.json({
            teste: 'Only a test of Next Bff',
            registroCriado: registroCriado
        })
        return;
    }

    response.status(404).json({
        message: 'Method GET not implemented yet, try POST'
    })

}