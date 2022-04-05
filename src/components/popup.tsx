import React from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IDialogProps {
    open: boolean;
    title?: string;
    dialogContent?: string;
    userName?: string;
    handleSubmit: () => void,
    handleClose: () => void,
    handleChange: (e: any) => void,
    didWin: boolean;
}

//component to show the popUp
const DialogCompoent = (props: IDialogProps) => {

    return (
        <Dialog
            open={props.open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {props.title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.dialogContent}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {
                    props.didWin ? (

                        <>
                            <form
                                autoComplete="off"
                                onSubmit={(e: React.SyntheticEvent) => {
                                    e.preventDefault();
                                    props.handleSubmit();
                                }}
                            >
                                <div>
                                    <label>
                                        nom d'utilisateur:
                                        <input onChange={(event) => props.handleChange(event?.target.value)} type="text" name="text" value={props.userName} />
                                    </label>
                                </div>
                                <br />
                                <div>
                                    <button onClick={props.handleClose} className='new-button' type="submit" disabled={props.userName?.length === 0}>
                                        Envoyer
                                    </button>
                                </div>
                            </form>
                        </>

                    ) : (
                        <button onClick={props.handleClose} className='new-button' type="submit">
                            Accepter
                        </button>
                    )
                }

            </DialogActions>
        </Dialog>
    )
}




export default DialogCompoent;
