<template>
  <div class="release_ticket">
    <div class="logo"><img src="../assets/img/logo.png" /></div>
    <div class="release_ticket__header">WELCOME</div>
    <div class="release_ticket__sub_header">PLEASE SELECT TRANSACTION</div>
    <hr />
    <div class="window_container">
      <div class="window_container__item">
        <h6 class="window_container__item__header">WINDOW 1</h6>
        <button class="window_container__item__button">
          <h2>SUBMIT INSURANCE APPLICATION</h2>
          <h6>(ISUMITE ANG APLIKASYON SA SEGURO)</h6>
        </button>
        <button class="window_container__item__button">
          <h2>INQUIRY INSURANCE POLICY</h2>
          <h6>(PAGTATANONG TUNGKOL SA PATAKARAN NG SEGURO)</h6>
        </button>
      </div>
      <div class="window_container__item">
        <h6 class="window_container__item__header">WINDOW 2</h6>
        <button class="window_container__item__button">
          <h2>SUBMIT CLAIMS APPLICATION</h2>
          <h6>(ISUMITE ANG APLIKASYON NG INYONG CLAIM)</h6>
        </button>
        <button class="window_container__item__button">
          <h2>INQUIRY CHECK STATUS</h2>
          <h6>(PAGTATANONG KUNG ANU ANG KATAYUAN NG TSEKE)</h6>
        </button>
      </div>
      <div class="window_container__item">
        <h6 class="window_container__item__header">WINDOW 3</h6>
        <button class="window_container__item__button">
          <h2>PWD / SENIOR CITEZEN / PREGNANT</h2>
          <h6>(MAY KAPANSANAN / MATATANDA / BUNTIS)</h6>
        </button>
      </div>
      <div class="window_container__item">
        <h6 class="window_container__item__header">WINDOW 4</h6>
        <button class="window_container__item__button">
          <h2>CLAIM INDEMNITY CHECK</h2>
          <h6>(PAGKUHA NG BAYAD PINSALA)</h6>
        </button>
        <button class="window_container__item__button">
          <h2>INQUIRY CHECK AVAILABILITY</h2>
          <h6>(PAGTATANONG KUNG MAYROONG TSEKE)</h6>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "release-ticket",
};
</script>
<style lang="scss">
$margin: 15%;
.logo {
  position: absolute;
  top: 5%;
  left: 25%;
  z-index: -1;
  & img {
    width: 50vw;
    height: 90vh;
    opacity: 0.08;
  }
}
.release_ticket {
  &__header {
    background: forestgreen;
    color: white;
    margin: 0px 0 5px 0;
    text-align: center;
    padding: 10px;
    font-size: 25px;
    letter-spacing: 1em;
  }

  &__sub_header {
    font-size: 20px;
    text-align: center;
  }
}

.window_container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  height: 100%;
  margin-left: $margin;
  margin-right: $margin;

  &__item {
    padding-bottom: 20px;
    margin-left: 5px;
    margin-right: 5px;

    &__header {
      text-align: center;
    }
    &__button {
      background: forestgreen;
      border: 0;
      width: 100%;
      color: white;
      padding-top: 5vh;
      padding-bottom: 5vh;
      margin-bottom: 10px;
      &:active {
        opacity: 0.9;
      }
    }
  }
}

@media screen and (max-height: 900px) {
  .window_container {
    &__item {
      &__button {
        padding-top: 3.5vh;
        padding-bottom: 3.5vh;
      }
    }
  }
}
</style>
