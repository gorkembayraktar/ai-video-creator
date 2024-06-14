import Versions from './components/Versions'
import { Unstable_Grid2 as Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StoryInput from './components/StoryInput';
import ElevenlabsSetting from './components/ElevenlabsSetting';
import { Button, Divider } from '@mui/material';
import MainTab from './components/MainTab';
import useGlobalStore from './store/globalStore'
import useTokenStore from './store/tokenStore'
import Token from './components/Token';
import BackdropTask from './components/BackdropTask';
import Explorer from './components/Explorer';
import InfoIcon from '@mui/icons-material/Info';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'white',
}));



function App(): JSX.Element {



  const { menuOpen, setMenuOpen } = useTokenStore((state) => ({

    menuOpen: state.menuOpen,
    setMenuOpen: state.setMenuOpen

  }));

  const { backdropTask, backdropMessage } = useGlobalStore((state) => ({

    backdropTask: state.backdropTask,
    backdropMessage: state.backdropMessage

  }));




  const handleES = () => {
    setMenuOpen(true)
  }

  return (
    <div className="container">
      <Explorer />
      <BackdropTask open={backdropTask} text={backdropMessage} Icon={<InfoIcon fontSize='large' />} />
      <Token />
      <ElevenlabsSetting />
      <Grid container spacing={2}>
        <Grid xs={4}>

          <Item sx={{ py: 4, px: 2 }} >
            <Button sx={{ mb: 2 }} onClick={handleES} variant='outlined' color='success' fullWidth>Elevenlabs Token</Button>
            <StoryInput />
            <Divider variant="inset" />

          </Item>

        </Grid>
        <Grid xs={8}>
          <Item>
            <MainTab></MainTab>
          </Item>
        </Grid>

      </Grid>

      <Versions></Versions>


    </div >
  )
}

export default App
