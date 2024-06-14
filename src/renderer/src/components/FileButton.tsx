import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function FileButton({ text, accept, onChange, sx = {} }): JSX.Element {

    return (
        <Button
            component="label"
            role={undefined}
            variant="outlined"
            tabIndex={-1}
            size='small'
            sx={sx}

        >
            {text}
            <VisuallyHiddenInput type="file" accept={accept} onChange={onChange} />
        </Button>

    )
}

export default FileButton