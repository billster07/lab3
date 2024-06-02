import axios from "axios";
import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import SomeContext from "../SomeContext";
import EditScore from "../components/EditScore";

// const DivMain = styled.div`

// `

const Div = styled.div`
  display: flex;
  flex-direction: column;
`;

const DivMatch = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  border-radius: 10px;
  margin: 20px;
  background: #fff;
`;

const DivMatchInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50%;
  width: 100%;
  & > p {
    font-size: 1.1rem;
  }
`;

const DivTeams = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60%;
`;

const P = styled.p`
  font-size: 20px;
  margin: 0 5px 0 5px;
`;

const DivScore = styled.div`
  text-align: center;
  width: 20px;
`;

const VS = styled.p`
  margin: 0 5px 0 5px;
`;

const DivTime = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Time = styled.p`
  margin-top: 5px;
  text-align: center;
`;

const Group = styled.p`
  position: absolute;
  left: 23px;
  margin: 5px 0 0 5px;
`;

const Button = styled.button`
  position: absolute;
  right: 27px;
  margin: 5px 0 0 5px;
`;

const DivForm = styled.div`
  display: flex;
  justify-content: center;
  width: 350px;
`;

const Form = styled.form`
  width: 90%;

  & label:nth-of-type(odd) span {
    left: -53px;
  }

  & label:first-of-type span {
    margin-left: 5px;
  }
`;

const Label = styled.label`
  width: 30%;
`;

const Input = styled.input`
  width: 30%;
  height: 20px;
  border-radius: 3px;
  border: 2px solid #014ea1;
  background-color: white;
  -webkit-appearance: none; /*to disable the default appearance of radio button*/
  -moz-appearance: none;

  &:focus {
    outline: none;
  }
  &:checked {
    background-color: #014ea1;
  }
  &:checked + span {
    color: white;
  }

  & + span {
    position: relative;
    left: -52px;
    top: -5.5px;
    font-size: 15px;
    color: #014ea1;
  }
`;

// const InputSubmit = styled.input`
//   margin-left: 15px;
// `

// const Label = styled.label`
//   &:nth-of-type(odd) span {
//     left: -10px;
//   }
// `

interface Match {
  id: number;
  home_team: number;
  away_team: number;
  goals_home: number | null;
  goals_away: number | null;
  stage: string;
  match_date: string;
  kick_off: string;
  groups: string;
}

interface Bet {
  user_id: number;
  match_id: number;
  result: string;
  date: string;
}

const Fixtures = () => {
  const [matches, setMatches] = useState<Match[] | null>([]);
  const [matchDates, setMatchDate] = useState<Array<string>>([]);
  const bet = ["1", "X", "2"];
  const [selectedBet, setSelectedBet] = useState<Array<string>>([]);
  const [userBet, setUserBet] = useState<Bet[] | null>([]);
  const [isActive, setIsActive] = useState(false);
  const [matchProps, setMatchProps] = useState<Match | null>(null);
  const context = useContext(SomeContext);

  const getMatches = async () => {
    console.log("start funktion")
    try {
      const response = await axios.get("/matches", {
        withCredentials: true,
      });
      setMatches(response.data);
      const newMatchDates = response.data.map(
        (match: Match) => match.match_date
      );
      setMatchDate((prevMatchDates) => {
        const uniqueDates = new Set([...prevMatchDates, ...newMatchDates]);
        return Array.from(uniqueDates);
      });
      const { data: existingBets } = await axios.get(
        "/bets",
        { withCredentials: true }
      );
      const createSelectedBet: Array<string> = [];
      response.data.forEach((match: Match) => {
        const bet_ = existingBets.find(
          (bet_: Bet) => match.id === bet_.match_id
        );
        if (bet_) {
          createSelectedBet.push(bet_.result);
        } else {
          createSelectedBet.push(bet[1]);
        }
      });
      setUserBet(existingBets);
      setSelectedBet(createSelectedBet);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (match: Match, array: Array<string>) => {
    await axios.post(
      "/bets",
      { match_id: match.id, result: array[match.id - 1] },
      { withCredentials: true }
    );
  };

  const checkBet = (match: Match) => {
    if (userBet) {
      if (userBet.find((bet_: Bet) => match.id === bet_.match_id)) {
        return true;
      }
    }
    return false;
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    match: Match
  ) => {
    const newArray = selectedBet.map((bet_, index) => {
      if (index === match.id - 1) {
        return event.target.value;
      } else {
        return bet_;
      }
    });
    setSelectedBet(newArray);
    handleSubmit(match, newArray);
  };

  const togglePopup = () => {
    setIsActive(!isActive);
    getMatches();
  };

  useEffect(() => {
    console.log("useeffect")
    getMatches();
  }, []);

  if (!context) {
    console.error("Context is null");
    return;
  }
  const { userInfo } = context;

  return (
    <>
      {matchDates &&
        matchDates.map((matchDate) => (
          <Div key={matchDates.indexOf(matchDate)}>
            <h2>{matchDate}</h2>
            {matches && (
              <div>
                {matches
                  .filter((match) => match.match_date === matchDate)
                  .map((match) => (
                    <DivMatch key={match.id}>
                      <DivTime>
                        <Group>Grupp {match.groups}</Group>
                        <Time>{match.kick_off}</Time>
                        {userInfo && userInfo.user_id === 1 && (
                          <Button
                            onClick={() => {
                              setMatchProps(match), togglePopup();
                            }}
                          >
                            Ändra
                          </Button>
                        )}
                      </DivTime>
                      <DivMatchInfo>
                        <DivTeams>
                          <P>{match.home_team}</P>
                          <DivScore>
                            <p>{match.goals_home}</p>
                          </DivScore>
                          <VS>-</VS>
                          <DivScore>
                            <p>{match.goals_away}</p>
                          </DivScore>
                          <P>{match.away_team}</P>
                        </DivTeams>
                      </DivMatchInfo>
                      <DivForm>
                        <Form>
                          {bet.map((value) => (
                            <Label key={value}>
                              {checkBet(match) ? (
                                <Input
                                  checked={value === selectedBet[match.id - 1]}
                                  name="selectedBet"
                                  onChange={(event) => {
                                    handleChange(event, match);
                                  }}
                                  type="radio"
                                  value={value}
                                />
                              ) : (
                                <Input
                                  name="selectedBet"
                                  onChange={(event) => {
                                    handleChange(event, match);
                                  }}
                                  type="radio"
                                  value={value}
                                />
                              )}
                              <span>{value}</span>
                            </Label>
                          ))}
                        </Form>
                      </DivForm>
                    </DivMatch>
                  ))}
              </div>
            )}
          </Div>
        ))}
      {isActive && (
        <EditScore matchProps={matchProps} togglePopup={togglePopup} />
      )}
    </>
  );
};

export default Fixtures;
