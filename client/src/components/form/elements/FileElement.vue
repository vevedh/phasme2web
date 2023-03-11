<template>
  <div class="q-form-file-upload q-form-builder-element" >
    <div class="q-px-sm">
      <div class="col-12 col-md-6">
        <q-uploader class="uploader-hidden" v-if="!innerValue" accept=".jpg, .pdf, image/*"  :url="uploadPath" @added="addFiles" @uploading="onStartUpload" @uploaded="onUpload" :label="getLabel" :field-name="'uri'" :ref="id" color="white" flat square />
        <q-btn v-if="!innerValue" icon-right="cloud_upload" :label="buttonLabel" :color="buttonColor" :disable="imgUploading" align="between" @click="pickFiles()" class="full-width" />
        <q-img contain v-if="innerValue" :src="imgRef" class="upload-display" @error="onImgLoadError">
          <div class="absolute-top text-subtitle2">
            {{ getLabel }}
            <span class="float-right">
              <q-btn flat round size="sm" icon="open_in_new" @click="viewOriginal">
                <q-tooltip>View Original</q-tooltip>
              </q-btn>
              <q-btn flat round size="sm" icon="delete" @click="unsetUpload">
                <q-tooltip>Remove</q-tooltip>
              </q-btn>
            </span>
          </div>
          <div class="absolute-bottom text-subtitle1 text-center" v-if="imgLoadFailed">
            No Preview Available
          </div>
        </q-img>
      </div>
    </div>
    <p class="col-12 col-md-6 text-negative text-caption" v-for="(error, idx) in errors" :key="idx">{{ error }}</p>
    <div v-if="hint" class="row q-col-gutter-sm">
      <p class="col-12 col-md-6 text-caption  text-italic q-pa-none" v-html="hint"></p>
    </div>
  </div>
</template>

<script>
import feathersClient from '../../../boot/feathers-client';
import FormElement from './FormElement'
import { QUploader, QImg, QBtn, QTooltip } from 'quasar'
export default {
  name: 'FileElement',
  extends: FormElement,
  components: { QUploader, QImg, QBtn, QTooltip },
  data: function () {
    return {
      imgLoadFailed: false,
      imgUploading: false
    }
  },
  props: {
    uploadPath: {
      type: String,
      default: `${window.location.origin}/uploads`
    }
  },
  methods: {
    pickFiles: function () {
      this.$refs[this.id].pickFiles()
    },
    addFiles(files) {
            //this.fields['img']=files[0].name;
            console.log('File :', files);
            this.innerValue = files[0].name;
            /*
            console.log('Files select :', files[0].name);
            this.backgroundFile = files[0].name;
            this.formFields = files[0].name;
            */
    },
    onStartUpload: function () {
      this.imgUploading = true
    },
    onUpload: function (response) {
      console.log('File to upload :',response)
      this.imgUploading = false
      this.innerValue = JSON.parse(response.xhr.response)
      this.validate()
    },
    unsetUpload: function () {
      this.innerValue = false
    },
    viewOriginal: function () {
      window.open(`/assets/${this.innerValue}`, '_blank')
    },
    onImgLoadError: function () {
      this.imgLoadFailed = true
    },
    validate: function () {
      this.errors = []
      if (this.required && !this.innerValue) {
        this.errors.push('This field is required.')
      }
      this.hasError = this.errors.length > 0
    }
  },
  computed: {
    imgRef: function () {
      return this.imgLoadFailed ? require('../../../assets/paperclip.svg') : `/assets/${this.innerValue}`
    },
    buttonColor: function () {
      return this.hasError ? 'negative' : 'grey-7'
    },
    buttonLabel: function () {
      return this.imgUploading ? 'Uploading...' : this.getLabel
    }
  }
}
</script>

<style lang="scss">
  .upload-display {
  max-height: 250px;
}
.q-uploader {
  display: none;
}
</style>
