import { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Input, Menu, Modal, Message, Label } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from '../../actions/index';
import useGetDataInRealTime from '../../hooks/useGetDataInRealTime';
import { useForm, Controller }  from 'react-hook-form';
import { addChannelInputsData } from '../../utils/utils';
import useAsync from '../../hooks/useAsync';
import { saveDataToDatabase } from '../../firebase/firebaseApi';

function Channels() {
  const {data: channels} = useGetDataInRealTime('channels');
  const { error, isError, isLoading, isSuccess, run, reset: addChannelErrorReset } = useAsync();

  const currentUser = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      isValid,
      errors,
    }
  } = useForm({ mode: 'onChange'});
  
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [ activeChannel, setActiveChannel ] = useState('');

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    addChannelErrorReset();
    reset();
  }, [addChannelErrorReset, reset]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const { channelName, channelDetails } = data;
    const channelData = {
      id: '',
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      }
    };
    run(saveDataToDatabase('channels', channelData));
  };

  const setFirstChannel = useCallback(() => {
    const firstChannel = channels[0];
    dispatch(setCurrentChannel(firstChannel));
    setActiveChannel(firstChannel?.id);
  }, [channels, dispatch]);

  const changeChannel = (channel) => {
    setActiveChannel(channel.id);
    dispatch(setCurrentChannel(channel));
  };

  useEffect(() => {
    setFirstChannel();
  }, [setFirstChannel]);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
    }
  }, [closeModal, isSuccess]);

  const displayChannels = (channels) => channels.length > 0 && channels.map((channel) => (
    <Menu.Item
      key={channel.id}
      onClick={() => changeChannel(channel)}
      name={channel.name}
      style={{ opacity: 0.7 }}
      active={channel.id === activeChannel}
    >
      # {channel.name}
    </Menu.Item>
  ));
  
  return (
    <>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> Каналы
          </span>{' '}
          ({channels?.length}) <Icon name='add' onClick={openModal} />
        </Menu.Item>
        { displayChannels(channels) }
      </Menu.Menu>
      <Modal basic open={isModalOpen} onClose={closeModal}>
        <Modal.Header>Добавить канал</Modal.Header>
        <Modal.Content>
          <Form noValidate>
            {
              addChannelInputsData.map((input, index) => (
                <Form.Field key={`${index}${input.name}`}>
                  <Controller
                    name={input.name}
                    control={control}
                    rules={input.validationRules}
                    render={({
                      field: { ref, ...inputProps },
                      fieldState: { invalid }
                    }) => (
                      <Input
                        fluid
                        label={input.label}
                        error={invalid}
                        {...inputProps}
                        value={inputProps.value || ''}
                      />
                    )}
                  />
                  {
                    errors[input.name] && (
                      <Label basic color='red' pointing='above'>
                        {errors[input.name].message}
                      </Label>
                    )
                  }
                </Form.Field>
              ))
            }
          </Form>
          {
            isError && (
              <Message error>
                <p>{error.message}</p>
              </Message>
            )
          }
        </Modal.Content>
        <Modal.Actions>
          <Button 
            color='green' 
            inverted 
            loading={isLoading} 
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            <Icon name='checkmark' /> Добавить
          </Button>
          <Button color='red' inverted onClick={closeModal}>
            <Icon name='remove' /> Отменить
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default Channels;
