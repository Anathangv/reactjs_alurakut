import { Fragment, useState, useEffect } from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken'
import { MainGrid } from '../src/componets/MainGrid/index';
import { Box } from '../src/componets/Box';
import AlurakutProfileSidebarMenuDefault, { AlurakutMenu, OrkutNostalgicIconSet } from '../src/lib/alurakutCommuns'
import { ProfileRelationsBoxWrapper } from '../src/componets/ProfileRelations/index'

export default function Home(props) {

  const githubUser = props.githubUser; //'anathan';
  const pesssoasFavoritas = ['peas','anathan','rennyer','mario','jhon','rocketseat'];
  const [comunidades, setComunidades] = useState([]);
  
  useEffect(() => {
    const x = fetch(`https://api.github.com/users/anathan/followers`)
    .then((response) => {
      return response.json();
    }).then((responseJson) => {
      console.log(responseJson);
    })

    //API DATO
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '61b183efca9cda6feec8c67f4fcb8e',
        'Content-Type':  'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities{
          title,
          id,
          imageUrl,
          creatorSlug
        }
      }` })
    }).then((response) => response.json())
    .then((respostaJson) => {
      const communitiesFromDato = respostaJson.data.allCommunities;
      console.log(communitiesFromDato);
      setComunidades(communitiesFromDato);
    })
  },[]);



  const BoxWrapperContent = ({title, contentList}) => {
    return(
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          {title} ({contentList && contentList.length})
        </h2>
        <ul>
          {contentList && contentList.map((itenAtual, index) => {
            return (
              <li key={index}>
                <a href={`/users/${itenAtual}`} key={itenAtual}>
                  <img src={`https://github.com/${itenAtual}.png`}/>
                  <span>{itenAtual}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </ProfileRelationsBoxWrapper>
    )
  }

  return (
    <Fragment>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <Box>
            <img src={`https://github.com/${githubUser}.png`} style={{borderRadius: '8px'}}/>
            <hr/>

            <p>
              <a className="boxLink" href={`https://github.com/${githubUser}`}>
                @{githubUser}
              </a>
            </p>
            <hr/>

            <AlurakutProfileSidebarMenuDefault/>
          </Box>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box as="aside"> 
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              
              const dadosDoForm = new FormData(e.target);

              const randomNumber = Math.floor((Math.random() * 100) + 1);
              
              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: 'system',
              }
              
              //this code only to avoid fullfil the form every time
              comunidade.title = `auto n# ${randomNumber}`
              comunidade.imageUrl = `https://picsum.photos/id/${randomNumber}/200/300`;//`https://picsum.photos/${randomNumber}`
              
               fetch('api/comunidades',{
                  method: 'POST',
                  headers:{
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade)
               }).then( async (response) => {
                 const dados = await response.json();
                 console.log(dados);
               })

              

              const comunidadesAtualizadas = [...comunidades];
              setComunidades([...comunidadesAtualizadas, comunidade]);

              }}>
              <div>
                <input 
                  placeholder="Qual o nome da sua comunidade?" 
                  name="title" 
                  aria-label="Qual o nome da sua comunidade?" />
              </div>
              <div>
                <input 
                  placeholder="Coloque uma URL para usarmos de capa" 
                  name="image" 
                  aria-label="Coloque uma URL para usarmos de capa"
                  />
              </div>
              <button>
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
          
          <BoxWrapperContent title='Seguidores' contentList={[]} />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pesssoasFavoritas.length})
            </h2>
            <ul>
              {pesssoasFavoritas.map((itenAtual, index) => {
                return (
                  <li key={index}>
                    <a href={`/users/${itenAtual}`} key={itenAtual}>
                      <img src={`https://github.com/${itenAtual}.png`}/>
                      <span>{itenAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <Box>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Minhas comunidades ({comunidades.length})
              </h2>
              <ul>
                {comunidades.map((itenAtual, index) => {
                  return (
                    <li key={index}>
                      <a href={`/users/${itenAtual.title}`} key={index}>
                        <img src={itenAtual.imageUrl}/>
                        <span>{itenAtual.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
          </Box>
        </div>
      </MainGrid>
    </Fragment>
  )
}

export async function getServerSideProps(context) {

  const cookies = nookies.get(context)
  const token = cookies.USER_TOKEN;
  
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth',{
    headers: {
      Authorization: token
    }
  }).then((resposta) => resposta.json())

  console.log("isAuthenticated", isAuthenticated);

  if(!isAuthenticated){
    return{
      redirect:{
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token)
  console.log("cookie", githubUser);
  
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}
