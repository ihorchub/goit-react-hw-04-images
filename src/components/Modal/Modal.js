import { Component } from 'react';
import { ModalWindow, Overlay } from './Modal.styled';

export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handlerKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handlerKeyDown);
  }

  handlerKeyDown = e => e.code === 'Escape' && this.props.onClose();

  handleBackdropClick = e =>
    e.currentTarget === e.target && this.props.onClose();

  render() {
    return (
      <Overlay onClick={this.handleBackdropClick}>
        <ModalWindow>
          <img src={this.props.url} alt="" />
        </ModalWindow>
      </Overlay>
    );
  }
}
