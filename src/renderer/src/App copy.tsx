import Versions from './components/Versions'
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import StoryInput from './components/StoryInput';
import ElevenlabsSetting from './components/ElevenlabsSetting';
import { Button, Divider } from '@mui/material';
import MainTab from './components/MainTab';
import useGlobalStore from './store/globalStore'


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#1A2027',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.mode === 'dark' ? theme.palette.text.secondary : 'white',
}));



function App(): JSX.Element {

  const { updateElevenlabsOpen } = useGlobalStore((state) => ({

    updateElevenlabsOpen: state.updateElevenlabsOpen
  }));

  const handleElevenlabs = () => {
    updateElevenlabsOpen(true)
  }

  return (
    <div className="container">

      <ElevenlabsSetting />
      <Grid container spacing={2}>
        <Grid xs={4}>

          <Item sx={{ py: 4, px: 2 }} >
            <StoryInput />
            <Divider variant="inset" />
            <Button onClick={handleElevenlabs} fullWidth>Elevenlabs Ayarla</Button>
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
