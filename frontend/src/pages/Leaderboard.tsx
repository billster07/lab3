import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
`;

const DivLeaderboard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DivUser = styled.div`
  width: 90%;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  background-color: #014ea1;
  color: #fff;
  border-radius: 30px;
  padding: 30px;
`;

interface LeaderboardData {
  id: number;
  username: string;
  match_id: number;
  user_result: string;
  goals_home: number | null;
  goals_away: number | null;
}

interface LeaderboardUser {
  username: string;
  points: number;
}

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[] | null>([]);
  const getLeaderboard = async () => {
    const { data } = await axios.get("/leaderboard");
    const users: Array<LeaderboardUser> = [];
    await data.forEach((user: LeaderboardData) => {
      const findUser = users.find((user_) => user_.username === user.username);
      if (!findUser) {
        users.push({ username: user.username, points: 0 });
      }
    });
    await data.map((bet: LeaderboardData) => {
      if (bet.goals_away !== null && bet.goals_home !== null) {
        if (bet.goals_home > bet.goals_away && bet.user_result === "1") {
          const updatePoints = users.find(
            (user) => user.username === bet.username
          );
          if (updatePoints) {
            updatePoints.points = updatePoints.points + 1;
          }
        } else if (
          bet.goals_home === bet.goals_away &&
          bet.user_result === "X"
        ) {
          const updatePoints = users.find(
            (user) => user.username === bet.username
          );
          if (updatePoints) {
            updatePoints.points = updatePoints.points + 1;
          }
        } else if (bet.goals_home < bet.goals_away && bet.user_result === "2") {
          const updatePoints = users.find(
            (user) => user.username === bet.username
          );
          if (updatePoints) {
            updatePoints.points = updatePoints.points + 1;
          }
        }
      }
    });
    users.sort((a, b) => {
      return b.points - a.points;
    });
    setLeaderboard(users);
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  return (
    <>
      <Div>
        <h1>Leaderboard</h1>
      </Div>
      {leaderboard && (
        <DivLeaderboard>
          {leaderboard.map((user, index) => (
            <DivUser key={index}>
              <p>{index + 1}</p>
              <p>{user.username}</p>
              <p>{user.points} poäng</p>
            </DivUser>
          ))}
        </DivLeaderboard>
      )}
    </>
  );
};

export default Leaderboard;
