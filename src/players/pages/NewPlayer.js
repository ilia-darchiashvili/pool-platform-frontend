import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlayerForm.scss';

const NewPlayer = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      firstName: {
        value: '',
        isValid: false
      },
      lastName: {
        value: '',
        isValid: false
      },
      totalMatches: {
        value: 0,
        isValid: false
      },
      matchesWon: {
        value: 0,
        isValid: true
      },
      totalRacks: {
        value: 0,
        isValid: true
      },
      racksWon: {
        value: 0,
        isValid: true
      },
      highestPlace: {
        value: 0,
        isValid: true
      },
      rankingPoints: {
        value: 0,
        isValid: true
      },
      isFemale: {
        value: false,
        isValid: true
      }
    },
    false
  );

  const navigate = useNavigate();

  const playerSubmitHandler = async event => {
    event.preventDefault();
    try {
      const firstName = formState.inputs.firstName.value;
      const lastName = formState.inputs.lastName.value;
      const totalMatches = formState.inputs.totalMatches.value || 0;
      const matchesWon = formState.inputs.matchesWon.value || 0;
      const totalRacks = formState.inputs.totalRacks.value || 0;
      const racksWon = formState.inputs.racksWon.value || 0;
      const highestPlace = formState.inputs.highestPlace.value;
      const rankingPoints = formState.inputs.rankingPoints.value;
      const isFemale = formState.inputs.isFemale.checked;
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/players`, 'POST',
      JSON.stringify({
        firstName,
        lastName,
        totalMatches,
        matchesWon,
        totalRacks,
        racksWon,
        highestPlace,
        rankingPoints,
        isFemale
      }),
      {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
      });
      navigate('/players');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="player-form" onSubmit={playerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay="center" />}
        <Input
          id="firstName"
          element="input"
          type="text"
          label="First Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid first name."
          onInput={inputHandler}
        />
        <Input
          id="lastName"
          element="input"
          type="text"
          label="Last Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid last name."
          onInput={inputHandler}
        />
        <Input
          id="totalMatches"
          element="input"
          type="number"
          label="Total Matches"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total matches."
          onInput={inputHandler}
        />
        <Input
          id="matchesWon"
          element="input"
          type="number"
          label="Matches Won"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid matches won."
          onInput={inputHandler}
        />
        <Input
          id="totalRacks"
          element="input"
          type="number"
          label="Total Racks"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total racks."
          onInput={inputHandler}
        />
        <Input
          id="racksWon"
          element="input"
          type="number"
          label="Racks won"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid racks won."
          onInput={inputHandler}
        />
        <Input
          id="highestPlace"
          element="input"
          type="number"
          label="Highest Place"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid highest place."
          onInput={inputHandler}
        />
        <Input
          id="rankingPoints"
          element="input"
          type="number"
          label="Ranking Points"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid ranking points."
          onInput={inputHandler}
        />
        {/* <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        /> */}
        <Input
            element="input"
            id="isFemale"
            type="checkbox"
            label="Female"
            onInput={inputHandler}
            validators={[]}
            initialValid={true}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLAYER
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlayer;
