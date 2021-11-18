import { Fragment } from 'react';
import { MainGrid } from './src/componets/MainGrid/index';
import { Box } from './src/componets/Box';
import { AlurakutMenu, OrkutNostalgicIconSet } from './src/lib/alurakutCommuns'
import { ProfileRelationsBoxWrapper } from './src/componets/ProfileRelations/index'

export default function Home() {

  const githubUser = 'anathan';
  const pesssoasFavoritas = ['peas','anathan','rennyer','mario','jhon','rocketseat'];

  return (
    <Fragment>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{gridArea: 'profileArea'}}>
          <Box>
            <img src={`https://github.com/${githubUser}.png`} style={{borderRadius: '8px'}}/>
          </Box>
        </div>
        <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
          <Box> 
            <h1 className="title">
              Bem vindo(a)
            </h1>

            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
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
          <Box>Comunidades</Box>
        </div>
      </MainGrid>
    </Fragment>
  )
}
