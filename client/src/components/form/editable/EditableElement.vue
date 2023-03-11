<template>
  <div class="q-editable-element">
    <div class="overlay" @click="onClick"></div>
    <component v-bind:is="element" :label="value.label" :required="value.required" :field_options="value.field_options" :show_options="value.show_options" :id="value.id" :cid="value.cid" :labelToolTip="value.labelToolTip" />
  </div>
</template>

<script>
import TextElement from '../elements/TextElement'
import CacemusersElement from '../elements/CacemusersElement'
import CommunesElement from '../elements/CommunesElement'
import ParagraphElement from '../elements/ParagraphElement'
import CheckboxesElement from '../elements/CheckboxesElement'
import RadioElement from '../elements/RadioElement'
import DateElement from '../elements/DateElement'
import TimeElement from '../elements/TimeElement'
import DropdownElement from '../elements/DropdownElement'
import EmailElement from '../elements/EmailElement'
import NameElement from '../elements/NameElement'
import SimpleNameElement from '../elements/SimpleNameElement'
import AddressElement from '../elements/AddressElement'
import PhoneElement from '../elements/PhoneElement'
import FileElement from '../elements/FileElement'
import PaymentElement from '../elements/PaymentElement'
import TermsElement from '../elements/TermsElement'
import SectionBreakElement from '../elements/SectionBreakElement'
import PageBreakElement from '../elements/PageBreakElement'
import ImageElement from '../elements/ImageElement'
import PassagersElement from '../elements/PassagersElement'
import HiddenElement from '../elements/HiddenElement'


export default {
  name: 'EditableElement',
  components: { TextElement, CacemusersElement,CommunesElement,
  ParagraphElement, CheckboxesElement, RadioElement, ImageElement,
  DateElement, TimeElement, DropdownElement, EmailElement, NameElement,
   SimpleNameElement, AddressElement, PhoneElement, FileElement,
    PaymentElement, TermsElement, SectionBreakElement, PageBreakElement, PassagersElement,HiddenElement },
  props: ['value'],
  methods: {
    onClick: function () {

      this.$emit('click', this.value)
    }
  },
  computed: {
    element: function () {

        const nameParts = this.value.field_type.split('_')
        for (let i = 0; i < nameParts.length; i++) {
          nameParts[i] = nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1)
        }
        return nameParts.join('') + 'Element'

    }
  },
    beforeMount() {


        if (!Object(this.value).hasOwnProperty('show_options')) {
        this.value.show_options = []
      }

      if (!Object(this.value).hasOwnProperty('span')) {
        this.value.span = 12
      }
       if (this.value.field_options) {
         if (!Object(this.value.field_options).hasOwnProperty('filled')) {
            this.value.field_options['filled'] = false
          }
          if (!Object(this.value.field_options).hasOwnProperty('stack-label')) {
            this.value.field_options['stack-label'] = false
          }

       }


      console.log('Init vals :',this.value)
    }
}
</script>

<style scoped>
  .q-editable-element {
    position: relative;

    padding: 5px;
  }

  .overlay {
    position: absolute;
    z-index: 2;
    cursor: pointer;
    width: 100%;
    height: 100%;

  }
</style>
