<template>
  <div class="beer" :class="{'rated-positive': rating > 0, 'rated-negative': rating < 0, 'expanded': expanded, 'saved': saved && rating === 0}">
    <div class="placard">
      <div class="beer-data" @click="expanded = !expanded">
        <p class="beer-name">
          {{ beer.name }}
        </p>
        <p class="beer-style">
          {{ beer.style }}
        </p>
        <p class="beer-abv">
          {{ beer.abv }}% ABV
        </p>
      </div>
      <div class="beer-action">
        <button class="thumb-rating thumbs-up" :class="{ active: rating > 0 }" @click="rating = rating <= 0 ? 1 : 0">
          <ThumbsUpIcon />
        </button>
        <button class="thumb-rating thumbs-up" :class="{ active: rating < 0 }" @click="rating = rating >= 0 ? -1 : 0">
          <ThumbsDownIcon />
        </button>
      </div>
    </div>

    <transition name="more">
      <div v-show="expanded" class="beer-more">
        <div class="more-info stack">
          <p class="beer-notes">
            {{ beer.notes }}
          </p>
          <p v-if="beer.location">
            <span class="label">Find it:</span> Table {{ beer.location }}
          </p>
        </div>
        <div class="more-actions">
          <button class="save-btn" :class="{ active: saved }" @click="saveBeer">
            <span class="icon"><StarIcon /></span>
            <span class="label">{{ saved ? 'Unsave' : 'Save' }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ThumbsUpIcon from '@/svg/thumbs-up';
import ThumbsDownIcon from '@/svg/thumbs-down';
import StarIcon from '@/svg/star';

export default {
  name: 'Beer',
  components: { ThumbsUpIcon, ThumbsDownIcon, StarIcon },
  props: {
    beer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      saved: false,
      rating: 0,
      expanded: false,
    };
  },
  methods: {
    saveBeer() {
      this.saved = !this.saved;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/abstracts/abstracts';

$bullet-size: 16px;

.label {
  @include label();
}

.beer {
  position: relative;
  padding: 1rem 1rem 1rem 3rem;
  margin-top: 1rem;

  &.expanded {
    background-color: $c--gray-e;
    padding-left: 1rem;
  }

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 3rem;
    top: 0;
    right: 1rem;
    height: 1px;
    background-color: $c--gray-e;
  }
}

.placard {
  position: relative;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    position: absolute;
    width: $bullet-size;
    height: $bullet-size;
    left: -2rem;
    top: 50%;
    margin-top: -#{$bullet-size / 2};
    border-radius: 50%;

    .rated-positive & {
      background-color: $c--teal;
    }

    .rated-negative & {
      background-color: $c--gray-d;
    }

    .saved & {
      background-color: $c--yellow;
    }
  }
}

.beer-style,
.beer-abv,
.more-info {
  font-size: $fs--sm;
}

.beer-style {
  font-style: italic;
}

.beer-data,
.more-info {
  flex: 1;
}

.beer-action,
.more-actions {
  flex: 0 0 88px;
  width: 88px;
}

.thumb-rating {
  width: 44px;
  height: 44px;
  padding: 10px;

  &:focus {
    outline: none;
  }

  svg {
    width: 100%;
    display: block;
    fill: none;
    stroke: $c--gray-9;
    stroke-width: 1;
  }

  &.active svg {
    fill: $c--teal;
    stroke: $c--teal;
  }
}

.beer-more {
  margin-top: 1rem;
  display: none;

  .expanded & {
    display: flex;
  }
}

.beer-notes {
  color: $c--gray-6;
}

.more-actions {
  text-align: center;
}

.save-btn {
  &:focus {
    outline: none;
  }

  svg {
    margin: auto;
    display: block;
    width: 24px;
    fill: none;
    stroke: $c--gray-9;
  }

  &.active svg {
    fill: $c--yellow;
    stroke: $c--yellow;
  }
}

// Animation
.more-enter-active,
.more-leave-active {
  @include transition(opacity);
}

.more-leave-to {
  transition-duration: 0s;
}

.more-enter,
.more-leave-to {
  opacity: 0;
}



</style>

