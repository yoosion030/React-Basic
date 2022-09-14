import "./App.css";
import React from "react";
import Title from './components/Title'

// localStorage에 세팅 및 저장
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

// 생성 버튼 누른 후 api 호출 함수
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem({ img }) {
  return (
    <li>
      <img
        src={img}
        style={{
          width: "150px",
        }}
      />
    </li>
  );
}

// 좋아요 누른 Item list
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((favorite, id) => (
        <CatItem img={favorite} key={id} />
      ))}
    </ul>
  );
}

// 메인 사진
const MainCard = ({ img, onHeartClick, alreadyFavorites }) => {
  const heartIcon = alreadyFavorites ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  // input 예외처리
  function handleInputChange(e) {
    const userValue = e.target.value;
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
      return;
    }

    setValue(userValue.toUpperCase());
  }

  // 생성 버튼 눌렀을 때 input 예외처리
  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        value={value}
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p
        style={{
          color: "red",
        }}
      >
        {errorMessage}
      </p>
    </form>
  );
};



const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [mainCat, setMainCat] = React.useState(CAT1);
  // const [counter, setCounter] = React.useState(
  //   jsonLocalStorage.getItem("counter")
  // );

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  // const [favorites, setFavorites] = React.useState(
  //   jsonLocalStorage.getItem("favorites") || []
  // );

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });
  // 하트이미누름
  const alreadyFavorites = favorites.includes(mainCat);

  // 첫 렌더링 시 이미지 세팅
  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  React.useEffect(() => {
    // App이 새로운 UI를 그릴 때 마다 실행
    console.log("counter");
  }, [counter]);

  // App이 새로운 UI를 그릴 때 마다 실행
  console.log("hello");

  // 생성버튼 누르고 난 후 메인 사진 수정
  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    const nextCounter = counter + 1;
    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  // 하트버튼 눌렀을 때 함수
  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  //props로 함수를 넘길 때 props명을 on~~로 시작
  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}
        alreadyFavorites={alreadyFavorites}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};
// App 을 밖에서도 쓸 수 있게 선언
export default App;
