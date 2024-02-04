import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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

  const [loadedPlayer, setLoadedPlayer] = useState();
  const playerId = useParams().playerId;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerId) {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/players/${playerId}`
          );
          setLoadedPlayer(responseData?.player || {});
        } catch (err) {}
      }
    };
    fetchPlayer();
  }, [sendRequest, playerId]);

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
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/players${playerId ? ('/' + playerId) : ''}`, playerId ? 'PATCH' : 'POST',
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
      navigate(`/players${playerId ? ('/' + playerId + '/stats') : ''}`);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="player-form" onSubmit={playerSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay="center" />}
        {(!playerId || !!loadedPlayer) && (
          <>
            <Input
              id="firstName"
              element="input"
              type="text"
              label="First Name"
              validators={[VALIDATOR_REQUIRE()]}
              initialValue={loadedPlayer?.firstName}
              initialValid={!!loadedPlayer ? true : false}
              errorText="Please enter a valid first name."
              onInput={inputHandler}
            />
            <Input
              id="lastName"
              element="input"
              type="text"
              label="Last Name"
              validators={[VALIDATOR_REQUIRE()]}
              initialValue={loadedPlayer?.lastName}
              initialValid={!!loadedPlayer ? true : false}
              errorText="Please enter a valid last name."
              onInput={inputHandler}
            />
            <Input
              id="totalMatches"
              element="input"
              type="number"
              label="Total Matches"
              validators={[]}
              initialValue={loadedPlayer?.totalMatches}
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
              initialValue={loadedPlayer?.matchesWon}
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
              initialValue={loadedPlayer?.totalRacks}
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
              initialValue={loadedPlayer?.racksWon}
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
              initialValue={loadedPlayer?.highestPlace}
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
              initialValue={loadedPlayer?.rankingPoints}
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
                initialValue={loadedPlayer?.isFemale}
                initialValid={true}
            />
          </>
        )}
        <Button type="submit" disabled={!formState.isValid}>
          {!!loadedPlayer ? "UPDATE PLAYER" : "ADD PLAYER"}
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlayer;
