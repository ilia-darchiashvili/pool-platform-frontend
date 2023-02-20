import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import Card from '../../shared/components/UIElements/Card';
import MatchItem from '../../matches/components/MatchItem';
import maleIcon from '../../shared/assets/maleIcon.jpg';
import femaleIcon from '../../shared/assets/femaleIcon.jpg';
import './CompareItem.css';

const CompareItem = ({ loadedPlayers }) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [matches, setMatches] = useState();
    const [player1, setPlayer1] = useState();
    const [player1String, setPlayer1String] = useState();
    const [player2, setPlayer2] = useState();
    const [player2String, setPlayer2String] = useState();
    const navigate = useNavigate();

    const goToPlayerStats = playerId => {
        navigate('/players/' + playerId + '/stats');
    }

    const handlePlayer1 = event => {
        setPlayer1(JSON.parse(event?.target?.value));
        setPlayer1String(event?.target?.value);
    }
    const handlePlayer2 = event => {
        setPlayer2(JSON.parse(event?.target?.value));
        setPlayer2String(event?.target?.value);
    }

    useEffect(() => {
        if (player1 && player2) {
            const fetchMatches = async () => {
                try {
                    const responseData = await sendRequest(
                        `${process.env.REACT_APP_BACKEND_URL}/matches/players/${player1.id}/${player2.id}`
                    );
                    setMatches(responseData.matches);
                } catch (err) { }
            };
            fetchMatches();
        }
    }, [player1, player2]);

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="compare-card">
                <div className="center">
                    <div className="player-select-wrapper">
                        {player1 && <img className="compare-player-image" src={player1.isFemale ? femaleIcon : maleIcon} alt="Player Image" onClick={() => goToPlayerStats(player1.id)} />}
                        <select
                            id="comparePlayer1"
                            onChange={handlePlayer1}
                            className="player-select center"
                            value={player1String}
                        >
                            <option key={"null-value"} value={null} className="hide-select-placeholder">Select Player 1</option>
                            {loadedPlayers.map(player => (
                                <option key={player.id} value={JSON.stringify(player)}>{player.displayName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="player-select-wrapper">
                        {player2 && <img className="compare-player-image" src={player2.isFemale ? femaleIcon : maleIcon} alt="Player Image" onClick={() => goToPlayerStats(player2.id)} />}
                        <select
                            id="comparePlayer2"
                            onChange={handlePlayer2}
                            className="player-select center"
                            value={player2String}
                        >
                            <option key={"null-value"} value={null} className="hide-select-placeholder">Select Player 2</option>
                            {loadedPlayers.map(player => (
                                <option key={player.id} value={JSON.stringify(player)}>{player.displayName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {player1 && player2 &&
                    <div className="compare-stats-content">
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{player1.totalMatches}</div>
                            <div>Total Matches</div>
                            <div className="stat-divider-player-2">{player2.totalMatches}</div>
                        </div>
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{(player1.matchesWon) + (Math.round(player1.matchesWon / player1.totalMatches * 100) >= 0 && (' (' + Math.round(player1.matchesWon / player1.totalMatches * 100) + '%)'))}</div>
                            <div>Matches Won</div>
                            <div className="stat-divider-player-2">{(player2.matchesWon) + (Math.round(player2.matchesWon / player2.totalMatches * 100) >= 0 && (' (' + Math.round(player2.matchesWon / player2.totalMatches * 100) + '%)'))}</div>
                        </div>
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{player1.totalRacks}</div>
                            <div>Total Racks</div>
                            <div className="stat-divider-player-2">{player2.totalRacks}</div>
                        </div>
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{(player1.racksWon) + (Math.round(player1.racksWon / player1.totalRacks * 100) >= 0 && (' (' + Math.round(player1.racksWon / player1.totalRacks * 100) + '%)'))}</div>
                            <div>Racks Won</div>
                            <div className="stat-divider-player-2">{(player2.racksWon) + (Math.round(player2.racksWon / player2.totalRacks * 100) >= 0 && (' (' + Math.round(player2.racksWon / player2.totalRacks * 100) + '%)'))}</div>
                        </div>
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{player1.highestPlace ?? '-'}</div>
                            <div>Highest Place</div>
                            <div className="stat-divider-player-2">{player2.highestPlace ?? '-'}</div>
                        </div>
                        <div className="compare-stat-wrapper">
                            <div className="stat-divider-player-1">{player1.rankingPoints ?? '-'}</div>
                            <div>Total Ranking Points</div>
                            <div className="stat-divider-player-2">{player2.rankingPoints ?? '-'}</div>
                        </div>
                    </div>
                }
            </Card>
            {matches?.length > 0 && <h1 style={{ textAlign: 'center', color: 'white', marginTop: '45px' }}>Head-to-Head Matches</h1>}
            {matches?.length > 0 && matches.map(match => (
                <MatchItem key={match.id} match={match} />
            ))}
        </React.Fragment>
    );
};

export default CompareItem;
