import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Moment from 'moment';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { VALIDATOR_REQUIRE, VALIDATOR_UNIQUE_PLAYER } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Matches.scss';

const STAGES = [
    {
        value: null,
        displayName: 'Preliminary'
    },
    {
        value: 'Quarter-Final',
        displayName: 'Quarter-Final'
    },
    {
        value: 'Semi-Final',
        displayName: 'Semi-Final',
    },
    {
        value: 'Final',
        displayName: 'Final'
    }
];

const NewMatch = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayers, setLoadedPlayers] = useState();
  const [ defaultTournamentInfo, setDefaultTournamentInfo ] = useState();
  const [formState, inputHandler] = useForm(
    {
      tournamentName: {
        value: '',
        isValid: false
      },
      player1: {
        value: '',
        isValid: false
      },
      player2: {
        value: '',
        isValid: false
      },
      player1Id: {
        value: '',
        isValid: false
      },
      player2Id: {
        value: '',
        isValid: false
      },
      date: {
        value: null,
        isValid: false
      },
      stage: {
        value: '',
        isValid: true
      },
      player1Racks: {
        value: null,
        isValid: true
      },
      player2Racks: {
        value: null,
        isValid: true
      },
      player1Place: {
        value: null,
        isValid: true
      },
      player2Place: {
        value: null,
        isValid: true
      },
      player1RankingPoints: {
        value: null,
        isValid: true
      },
      player1RankingPoints: {
        value: null,
        isValid: true
      },
      isRankingEvent: {
        value: false,
        isValid: true
      },
      player1Walkover: {
        value: null,
        isValid: true,
      },
      player2Walkover: {
        value: null,
        isValid: false
      },
      isPlayer1Female: {
        value: false,
        isValid: true
      },
      isPlayer2Female: {
        value: false,
        isValid: true
      }
    },
    false
  );

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players`
        );
        const displayPlayers = responseData.players.map(player => {
            const displayName = player.lastName + ' ' + player.firstName
            return {...player, displayName};
        })
        setLoadedPlayers(displayPlayers);
      } catch (err) {}
    };

    const fetchTournamentInfo = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/next_event`
        );
        setDefaultTournamentInfo(responseData?.nextEvent || {});
      } catch (err) {}
    };

    fetchTournamentInfo();
    fetchPlayers();
  }, [sendRequest]);

  const navigate = useNavigate();

  const matchSubmitHandler = async event => {
    event.preventDefault();
    try {
      const tournamentName = formState.inputs.tournamentName.value;
      const player1Id = formState.inputs.player1.value?.split('/')?.[0];
      const player2Id = formState.inputs.player2.value?.split('/')?.[0];
      const player1 = formState.inputs.player1.value?.split('/')?.[1];
      const player2 = formState.inputs.player2.value?.split('/')?.[1];
      const date = formState.inputs.date.value;
      const stage = formState.inputs.stage.value !== "Preliminary" ? formState.inputs.stage.value : "";
      const player1Racks = +formState.inputs.player1Racks.value;
      const player2Racks = +formState.inputs.player2Racks.value;
      const player1Place = +formState.inputs.player1Place.value;
      const player2Place = +formState.inputs.player2Place.value;
      const player1RankingPoints = +formState.inputs.player1RankingPoints.value;
      const player2RankingPoints = +formState.inputs.player2RankingPoints.value;
      const isRankingEvent = formState.inputs.isRankingEvent.checked;
      const player1Walkover = formState.inputs.player1Walkover.checked;
      const player2Walkover = formState.inputs.player2Walkover.checked;
      const isPlayer1Female = formState.inputs.player1.value?.split('/')?.[2];
      const isPlayer2Female = formState.inputs.player2.value?.split('/')?.[2];
      const created_at = new Date();
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/matches`, 'POST',
      JSON.stringify({
        tournamentName,
        player1Id,
        player2Id,
        player1,
        player2,
        date,
        stage,
        player1Racks,
        player2Racks,
        player1Place,
        player2Place,
        player1RankingPoints,
        player2RankingPoints,
        isRankingEvent,
        player1Walkover,
        player2Walkover,
        isPlayer1Female,
        isPlayer2Female,
        created_at
      }),
      {
        Authorization: 'Bearer ' + auth.token,
        'Content-Type': 'application/json'
      });
      navigate('/matches');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="match-form" onSubmit={matchSubmitHandler}>
        {(isLoading || !loadedPlayers || !defaultTournamentInfo) && <LoadingSpinner asOverlay="center" />}
        {!!defaultTournamentInfo && (
          <>
            <Input
                id="tournamentName"
                element="input"
                type="text"
                label="Tournament Name"
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={defaultTournamentInfo.name}
                errorText="Please enter a valid tournament name."
                onInput={inputHandler}
            />
            <Input
                id="date"
                element="input"
                type="date"
                label="Date"
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={Moment(defaultTournamentInfo.dateTime).utc(true)?.toJSON().substring(0,10) ?? (new Date()).toJSON().substring(0, 10)}
                initialValid={true}
                errorText="Please enter a valid date."
                onInput={inputHandler}
            />
          </>
        )}
        <Input
            element="input"
            id="isRankingEvent"
            type="checkbox"
            label="Ranking Event"
            onInput={inputHandler}
            validators={[]}
            initialValid={true}
        />
        <Input
            id="stage"
            element="select"
            selectData={STAGES}
            label="Stage"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid stage."
            onInput={inputHandler}
        />
        <Input
            id="player1"
            element="select"
            selectData={loadedPlayers}
            placeholder="Select Player"
            label="Player 1"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_UNIQUE_PLAYER(formState.inputs.player2.value)]}
            errorText="Please enter a valid player 1."
            onInput={inputHandler}
        />
        <Input
            id="player2"
            element="select"
            selectData={loadedPlayers}
            placeholder="Select Player"
            label="Player 2"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_UNIQUE_PLAYER(formState.inputs.player1.value)]}
            errorText="Please enter a valid player 2."
            onInput={inputHandler}
        />
        {!formState?.inputs?.player2Walkover?.checked &&
            <Input
                element="input"
                id="player1Walkover"
                type="checkbox"
                label="Player 1 Walkover"
                onInput={inputHandler}
                validators={[]}
                initialValid={true}
            />
        }
        {!formState.inputs.player1Walkover.checked &&
          <Input
            element="input"
            id="player2Walkover"
            type="checkbox"
            label="Player 2 Walkover"
            onInput={inputHandler}
            validators={[]}
            initialValid={true}
          />
        }
        {(!formState?.inputs?.player1Walkover?.checked && !formState?.inputs?.player2Walkover?.checked) &&
          <>
            <Input
              id="player1Racks"
              element="input"
              type="number"
              label="Player 1 Racks"
              validators={[]}
              initialValid={true}
              errorText="Please enter a valid total player 1 racks."
              onInput={inputHandler}
            />
            <Input
              id="player2Racks"
              element="input"
              type="number"
              label="Player 2 Racks"
              validators={[]}
              initialValid={true}
              errorText="Please enter a valid total player 2 racks."
              onInput={inputHandler}
            />
          </>
        }
        <Input
          id="player1Place"
          element="input"
          type="number"
          label="Player 1 Place"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total player 1 place."
          onInput={inputHandler}
        />
        <Input
          id="player2Place"
          element="input"
          type="number"
          label="Player 2 Place"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total player 2 place."
          onInput={inputHandler}
        />
        <Input
          id="player1RankingPoints"
          element="input"
          type="number"
          label="Player 1 Ranking Points"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total player 1 ranking points."
          onInput={inputHandler}
        />
        <Input
          id="player2RankingPoints"
          element="input"
          type="number"
          label="Player 2 Ranking Points"
          validators={[]}
          initialValid={true}
          errorText="Please enter a valid total player 2 ranking points."
          onInput={inputHandler}
        />
        <Button type="submit" /*disabled={!formState.isValid}*/>
          ADD MATCH
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewMatch;
