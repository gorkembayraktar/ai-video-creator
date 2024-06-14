import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';
import useTokenStore from './../store/tokenStore'
import { Box, ButtonGroup, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItem, TextField } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import { getSubscription } from '../thirdparty/elevenlabs/api';
import { useAlert } from '../hooks/useAlert'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Token() {

  const { menuOpen: open, setMenuOpen, tokenList, addToken, removeToken } = useTokenStore((state) => (
    {
      menuOpen: state.menuOpen,
      tokenList: state.tokenList,
      setMenuOpen: state.setMenuOpen,
      addToken: state.addToken,
      removeToken: state.removeToken
    }
  ));

  const { info, error } = useAlert()

  const [tokenDetail, setTokenDetail] = React.useState({});

  const [formOpen, setFormOpen] = React.useState(false);


  React.useEffect(() => {
    if (!open) return;

    tokenDetails();

  }, [open])

  const tokenDetails = async () => {
    const promises = tokenList.map(async (token) => ({ token: token, data: await getSubscription(token) }));
    const data = await Promise.all(promises);
    const format = {};
    data.forEach(item => {
      format[item.token] = item.data
    })
    setTokenDetail(format)
  }


  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleAdd = () => {
    setFormOpen(true);
  }

  const handleSubmit = async (data) => {
    addToken(data.token)
    const sbs = await getSubscription(data.token);
    if (!sbs.character_count) {
      error('Servise erişilemedi');
    }
    setTokenDetail((state) => {
      const copy = { ...state };
      copy[data.token] = sbs;
      return copy;
    })

  }
  const handleRemove = (token) => {
    removeToken(token)
    setTokenDetail((state) => {
      const data = { ...state };
      delete data[token];
      return data;
    })
  }
  const handleReplay = async (token) => {
    const sbs = await getSubscription(token);
    setTokenDetail((state) => {
      const copy = { ...state };
      copy[token] = sbs;
      return copy;
    })

    info('Güncellendi')
  }
  return (
    <React.Fragment>
      <TokenForm open={formOpen} setOpen={setFormOpen} submit={handleSubmit} />
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Elevenlabs Token Listesi
            </Typography>
            <Button autoFocus color="success" variant='contained' onClick={handleAdd}>
              Yeni Ekle
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          {
            tokenList.length == 0 ?
              <Box sx={{ textAlign: 'center', p: 5 }}>Token ekleyiniz</Box>
              : Object.entries(tokenDetail).map(([token, data]) => <TokenItem token={token} data={data} remove={handleRemove} replay={handleReplay} />)
          }


        </List>
      </Dialog>
    </React.Fragment>
  );
}

const TokenItem = ({ token, data, remove, replay }) => {

  const errorText = <Typography fontSize={12} color="error">{"Servise erişilemedi"}</Typography>;
  const successText = `${Math.round(data.character_count / data.character_limit * 100)}%  karakter kullanıldı. (${data.character_count} / ${data.character_limit})`;


  const text = data.character_count ? successText : errorText;

  return <>
    <ListItem
      secondaryAction={
        <>
          <ButtonGroup aria-label="outlined primary button group">
            <IconButton sx={{ mr: 3 }} onClick={() => replay(token)} edge="end" aria-label="delete">
              <ReplayIcon />
            </IconButton>
            <IconButton onClick={() => remove(token)} edge="start" aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </ButtonGroup>

        </>


      }
    >
      <ListItemText
        primary={token}
        secondary={text}
      />

    </ListItem>

    <Divider />
  </>
}


const TokenForm = ({ open, setOpen, submit }) => {

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            submit(formJson);

            handleClose();
          },
        }}
      >
        <DialogTitle>Token Ekle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Elevenlabs token bilgisi
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="token"
            label="Token Address"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Kapat</Button>
          <Button type="submit">Kaydet</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}