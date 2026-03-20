import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal'

function renderModal(props = {}) {
  const onClose = props.onClose ?? vi.fn()
  render(
    <Modal title={props.title ?? 'Test Modal'} onClose={onClose}>
      {props.children ?? <p>Modal content</p>}
    </Modal>
  )
  return { onClose }
}

describe('Modal', () => {
  it('renders title and children', () => {
    renderModal({ title: 'My Modal', children: <p>Hello</p> })
    expect(screen.getByText('My Modal')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderModal()
    fireEvent.click(screen.getByRole('button'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when backdrop is clicked', () => {
    const { onClose } = renderModal()
    fireEvent.click(document.querySelector('.modal-backdrop'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const { onClose } = renderModal()
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when clicking inside the modal', () => {
    const { onClose } = renderModal()
    fireEvent.click(document.querySelector('.modal'))
    expect(onClose).not.toHaveBeenCalled()
  })
})
