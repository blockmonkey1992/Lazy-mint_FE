import React from "react";
import {Routes, Route} from "react-router-dom";
import Layout from "./components/Format/Layout";
import Landing from "./components/Landing/Landing";
import LazyMinting from "./components/Minting/LazyMinting";
import NftDetail from "./components/NftDeatil/NftDetail";
import Marketplace from "./components/Marketplace/Marketplace";
import My from "./components/My/My";
import NotFound from "./components/NotFound/NotFound";
import "./assets/css/global.scss";
import "./assets/css/normalize.scss";


function App() {
  return (
    <>
      <Routes>
        <Route 
          path="/" 
          element={<Layout childeren={<Landing />}></Layout>} 
        />
        <Route
          path="/marketplace"
          element={<Layout childeren={<Marketplace />}></Layout>}
        />
        <Route
          path="/lazymint"
          element={<Layout childeren={<LazyMinting />}></Layout>}
        />
        <Route
          path="/nft/:id"
          element={<Layout childeren={<NftDetail />}></Layout>}
        />
        <Route
          path="/my/:id"
          element={<Layout childeren={<My />}></Layout>}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </>
  );
}

export default App;
