import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const PopupDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);
  color: #000;

  display: flex;
  align-items: center;
  justify-content: center;
`;
const PopupDivInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

interface TogglePopup {
  togglePopup: () => void;
}

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

interface EditScoreProps extends TogglePopup {
  matchProps: Match | null;
}

const EditScore = ({ togglePopup, matchProps }: EditScoreProps) => {
  const [goalsHome, setGoalsHome] = useState<number | null>(null);
  const [goalsAway, setGoalsAway] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (matchProps) {
      await axios.post(
        "/matches",
        {
          goals_home: goalsHome,
          goals_away: goalsAway,
          match_id: matchProps.id,
        },
        { withCredentials: true }
      );
      togglePopup();
    }
  };

  return (
    <>
      <PopupDiv>
        <PopupDivInner>
          {matchProps && (
            <Form
              onSubmit={(event) => {
                event.preventDefault(), handleSubmit();
              }}
            >
              <label>
                {matchProps.home_team}:
                <input
                  type="number"
                  onChange={(event) => setGoalsHome(Number(event.target.value))}
                />
              </label>
              <label>
                {matchProps.away_team}:
                <input
                  type="number"
                  onChange={(event) => setGoalsAway(Number(event.target.value))}
                />
              </label>
              <input type="submit" />
            </Form>
          )}
        </PopupDivInner>
      </PopupDiv>
    </>
  );
};

export default EditScore;
