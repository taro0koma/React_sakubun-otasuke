import React from 'react';
import './NextPageLink.css';

const NextPageLink = ({imairu}) => {
  const style = `
  .${imairu}{
    display:none !important;
  }
`
  return (
    <div>
      <style>{style}</style>
      <section className="container" style={{marginTop:40}}>
        <h4>つぎはなにをつかってみる？</h4>
      <div className="row">
        <div className="column column-25 imagemap1">
          <a href="/map" className="box-link">
            <div className="box">
              <img src="/images/imagemapsenden2.png" alt="Page 1" className="box-image" />
              <p className="contentsmei">{"[イメージマップ]"}</p>
            <p className="contentssetumei">内容が思いつかないときはイメージマップを作ってみよう!</p>
            </div>
          </a>
        </div>
        <div className="column column-25 danraku1">
          <a href="/danraku" className="box-link">
            <div className="box">
              <img src="/images/danrakusenden.png" alt="Page 2" className="box-image" />
              <p className="contentsmei">{"[段落の組み立て]"}</p>
            <p className="contentssetumei">書き方がわからないときは段落の組み立てを使おう！</p>
            </div>
          </a>
        </div>
        <div className="column column-25 kimochi1">
          <a href="/kimoti" className="box-link">
            <div className="box">
              <img src="/images/iikaesenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[気持ちや感想のいいかえ]"}</p>
            <p className="contentssetumei">言葉をいいかえたいときは気持ちや感想のいいかえを使おう!</p>
            </div>
          </a>
        </div>
        <div className="column column-25 hyougen1">
          <a href="/hyougen" className="box-link">
            <div className="box">
              <img src="/images/iikaesenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[表現ぴったり探し]"}</p>
            <p className="contentssetumei">カッコよい表現にしたいときは表現ぴったり探しを使ってみよう!</p>
            </div>
          </a>
        </div>
        <div className="column column-25 zinbutu1">
          <a href="/zinbutsu" className="box-link">
            <div className="box">
              <img src="/images/zinbutusenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[登場人物の性格を表す言葉]"}</p>
            <p className="contentssetumei">人物をいいかえたいときは登場人物の性格を表す言葉!</p>
            </div>
          </a>
        </div>
        <div className="column column-25 kakidashi1">
          <a href="/omikuji" className="box-link">
            <div className="box">
              <img src="/images/kakidasisenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[書き出しおみくじ]"}</p>
            <p className="contentssetumei">書き出しをカッコよくしたいときは書き出しおみくじを使おう!</p>
            </div>
          </a>
        </div>
        <div className="column column-25 benri1">
          <a href="/osusume" className="box-link">
            <div className="box">
              <img src="/images/osusumesenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[おすすめツール]"}</p>
            <p className="contentssetumei">文字数・枚数確認できたり、イメージマップを作るのに便利なツールを紹介するよ！</p>
            </div>
          </a>
        </div>
        <div className="column column-25 benri1">
          <a href="/" className="box-link">
            <div className="box">
              <img src="/images/osusumesenden.png" alt="Page 3" className="box-image" />
              <p className="contentsmei">{"[作文作りのコツ]"}</p>
            <p className="contentssetumei">手順やコツを紹介するよ！</p>
            </div>
          </a>
        </div>
      </div>
    </section>
    </div>
  );
};

export default NextPageLink;