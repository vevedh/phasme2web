<template>
  <q-page class="container full-width">
    <q-pull-to-refresh @refresh="refresh" color="yellow-9" icon="lightbulb">
      <div class="row q-px-sm q-py-xs full-width">
        <div class="col-12 bg-white rounded-borders q-pa-none">
          <q-btn
            color="secondary"
            outline
            dense
            no-wrap
            @click="$q.fullscreen.toggle()"
            :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            class="q-mt-sm q-ml-sm q-pr-sm bg-white"
          />
          <q-btn
            v-if="$q.screen.gt.xs"
            outline
            dense
            no-wrap
            icon="add"
            no-caps
            color="green"
            label="Ajouter au parking"
            class="q-mt-sm q-ml-sm q-pr-sm bg-white"
            @click="showNewParking = true"
          ></q-btn>
          <q-btn-dropdown
            outline
            dense
            color="primary"
            icon="filter_list"
            class="q-mt-sm q-ml-sm bg-white"
            label="Selectionner un filtre"
          >
            <q-list>
              <q-item clickable @click.capture="filtreDateDuJour()" v-ripple>
                <q-item-section avatar>
                  <q-icon
                    name="done"
                    :color="isFilterDatejour ? 'green' : 'grey-3'"
                  />
                  <!--<q-checkbox ref="chkDatej" v-model="isFilterDatejour" />-->
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    >Pour le
                    <span class="text-bold">{{
                      datedujour
                    }}</span></q-item-label
                  >
                </q-item-section>
              </q-item>

              <q-item clickable v-ripple @click.capture="filtreDateAll()">
                <q-item-section avatar>
                  <q-icon
                    name="done"
                    :color="isFilterDateAll ? 'green' : 'grey-3'"
                  />
                  <!--<q-checkbox ref="chkDatej" v-model="isFilterDatejour" />-->
                </q-item-section>
                <q-item-section>
                  <q-item-label>Tout</q-item-label>
                </q-item-section>
              </q-item>

              <!--<q-item clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Filter 3</q-item-label>
                </q-item-section>
              </q-item>-->
            </q-list>
          </q-btn-dropdown>
          <q-btn
            outline
            dense
            no-wrap
            icon="today"
            no-caps
            color="primary"
            :label="datedujour"
            class="q-mt-sm q-ml-sm q-pr-sm bg-white text-bold"
            disabled
          ></q-btn>
          <q-btn flat outline v-if="showDev" dense class="q-text-bold q-pa-xs" color="blue-8">** DEV **</q-btn>

          <q-input
            class="float-right items-center justify-center q-pa-xs bg-white"
            v-model="searchValue"
            label="Rechercher ici"
            outlined
            dense
            style="width: 35%"
            @input="doSearch"
            ><!-- @input="doSearch"-->
            <template v-slot:append>
              <q-icon
                clickable
                v-ripple
                v-if="searchValue !== ''"
                name="close"
                @click="searchValue = ''"
                class="cursor-pointer"
              />
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <div class="row q-mt-xs bg-transparent rounded-borders full-width">
        <!--   Demandes en attentes de validation par le service Parc Auto -->
        <div class="col-4 q-px-xs">
          <div class="q-pa-xs column-background">
            <q-item class="q-pa-none text-white q-pa-sm to-do-title">
              <q-item-section avatar style="min-width: 25px">
                <q-icon name="taxi_alert" class="q-pa-none q-ma-none" />
              </q-item-section>
              <q-item-section class="text-h6 text-bold">
                <span
                  ><q-avatar size="33px" color="red" text-color="white">{{
                    visiteursParking_en_attente.length
                  }}</q-avatar>
                  En attentes</span
                >
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="more_vert" class="cursor-pointer">
                  <q-menu transition-show="rotate" transition-hide="rotate">
                    <q-list style="min-width: 100px">
                      <q-item clickable>
                        <q-item-section>Aujoud'hui</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>A la date du</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Toutes</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-item-section>
            </q-item>

            <q-card
              v-for="(element, attente_index) in visiteursParking_en_attente"
              v-bind:key="attente_index"
              flat
              bordered
              class="box-shadow bg-white q-mt-xs list-group-item border-todo"
              :style="
                element.etat == 'attente'
                  ? 'border-left: 5px solid red !important'
                  : ''
              "
            >
              <q-toolbar
                class="bg-transparent text-dark q-pa-none"
                style="min-height: 10px"
              >
                <q-btn flat round dense icon="event" />
                <q-separator dark vertical inset />
                <q-toolbar-title class="text-caption">
                  <span class="text-bold">Visite prévue le : </span
                  ><span class="text-h6"
                    >{{ element.datevisite }} à {{ element.heurevisite }}</span
                  >
                </q-toolbar-title>
                <!--<q-btn flat round dense icon="apps" class="q-mr-xs" />-->
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="
                    deleteDemande('visiteursParking_en_attente', attente_index)
                  "
                />
              </q-toolbar>

              <q-card-section class="q-pt-xs">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-center text-caption">
                      <span class="text-bold">Contact principal : </span
                      >{{ element.prenom }} {{ element.nom }}
                    </div>
                    <div class="text-caption">
                      <q-icon name="assignment_ind" size="2vh" />
                      <span class="text-bold">Demandeur :</span>
                      <span>
                        {{ element.contactinterne }}
                      </span>
                    </div>
                    <div>
                      <span class="text-bold">Occupants : </span
                      >{{ getNbPassagers(element.passagers) }}
                    </div>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-none">
                <q-btn
                  size="md"
                  flat
                  round
                  color="blue"
                  icon="speaker_notes"
                  @click="showDiagDetail(element)"
                >
                  <q-tooltip>Commentaires</q-tooltip>
                </q-btn>
                <!--<q-btn size="xs" dense filled round color="orange" icon="flag"/>showDiagPassagers(element.passagers)-->
                <q-btn
                  size="md"
                  flat
                  color="primary"
                  icon="arrow_forward_ios"
                  @click="
                    immatriculation = '';
                    currentCarIndex = attente_index;
                    carToAdd = Object.assign({}, element);
                    showAddParking = true;
                  "
                  ><q-tooltip> Ajouter au parking </q-tooltip></q-btn
                >
              </q-card-actions>
            </q-card>
          </div>
        </div>

        <!--   Demandes vehicules au parking -->
        <div class="col-4 q-px-xs">
          <div class="q-pa-xs column-background">
            <q-item class="q-pa-none text-white q-pa-sm test-title">
              <q-item-section avatar style="min-width: 25px">
                <q-icon name="drive_eta" class="q-pa-none q-ma-none" />
              </q-item-section>
              <q-item-section class="text-h6"
                ><span
                  ><q-avatar size="33px" color="teal-7" text-color="white">{{
                    visiteursParking_au_parking.length
                  }}</q-avatar>
                  Au parking</span
                ></q-item-section
              >
              <q-item-section avatar>
                <q-icon name="more_vert" class="cursor-pointer">
                  <q-menu transition-show="rotate" transition-hide="rotate">
                    <q-list style="min-width: 100px">
                      <q-item clickable>
                        <q-item-section>Aujoud'hui</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>A la date du</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Toutes</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-item-section>
            </q-item>

            <q-card
              square
              v-for="(element, parking_index) in visiteursParking_au_parking"
              v-bind:key="parking_index"
              flat
              bordered
              class="box-shadow bg-white q-mt-xs list-group-item border-test"
              :style="
                element.etat == 'parking'
                  ? 'border-left: 5px solid green !important'
                  : ''
              "
            >
              <q-toolbar
                class="bg-transparent text-dark q-pa-none"
                style="min-height: 10px"
              >
                <q-btn flat round dense icon="event" color="green" />
                <q-separator dark vertical inset />
                <q-toolbar-title class="text-caption">
                  <span class="text-bold">Le : </span
                  ><span class="text-h6"
                    ><span class="text-green text-bold text-h5">{{
                      element.dateparking
                    }}</span>
                    à
                    <span class="text-red text-bold text-h5">{{
                      element.heureparking
                    }}</span></span
                  >
                </q-toolbar-title>
                <!--<q-btn flat round dense icon="apps" class="q-mr-xs" />-->
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="
                    deleteDemande('visiteursParking_au_parking', parking_index)
                  "
                />
              </q-toolbar>
              <q-card-section class="q-pt-xs">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-center">
                      <span class="text-bold">Immatriculation : </span>
                      <span class="text-bold text-h5">{{
                        element.immatriculation.toUpperCase()
                      }}</span>
                    </div>
                    <div class="text-center text-caption">
                      <span class="text-bold">Contact principal : </span
                      >{{ element.prenom }} {{ element.nom }}
                    </div>
                    <div class="text-caption">
                      <q-icon name="assignment_ind" size="3vh" />
                      <span class="text-bold">Demandeur :</span>
                      <span>
                        {{ element.contactinterne }}
                      </span>
                    </div>
                    <div>
                      <span class="text-bold">Occupants : </span
                      >{{ getNbPassagers(element.passagers) }}
                    </div>
                    <q-chip
                      dense
                      color="primary"
                      text-color="white"
                      icon="directions_car"
                      Ice
                      cream
                      v-for="(elt, index) in element.passagers"
                      :key="`at_passager_${index}`"
                    >
                      <q-separator
                        dark
                        vertical
                        inset
                        class="q-my-none q-mx-sm"
                      />&nbsp;
                      <span>
                        {{ elt.nom }} {{ elt.prenom }}&nbsp;&nbsp;&nbsp;</span
                      >
                      <!--<span class="text-bold q-px-md">
                        <q-icon name="warehouse" size="2vh" />
                      </span>-->
                      <q-separator
                        dark
                        vertical
                        inset
                        class="q-my-none q-mx-sm"
                      />&nbsp;
                      <span> Société : {{ elt.societe }}</span>
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="left" class="q-pa-none">
                <q-btn
                  
                 
                  round
                  dense
                  color="accent"
                  icon="minor_crash"
                  @click="
                    immatriculation = '';
                    currentCarIndex = parking_index;
                    carToAddV = Object.assign({}, element);
                    showAddVehiculeParking = true;
                  "
                >
                  <q-badge color="dark" floating >+</q-badge>
                  <q-tooltip>Nouveau Véhicule</q-tooltip>
                </q-btn>
               <q-space />
                <q-btn
                  size="md"
                  flat
                  round
                  color="blue"
                  icon="speaker_notes"
                  @click="showDiagDetail(element)"
                >
                  <q-tooltip>Commentaires</q-tooltip>
                </q-btn>
                <!--<q-btn size="xs" dense filled round color="orange" icon="flag"/>showDiagPassagers(element.passagers)-->
                <q-btn
                  size="md"
                  flat
                  color="primary"
                  icon="logout"
                  @click="
                    sortieParking('visiteursParking_au_parking', parking_index)
                  "
                  ><q-tooltip> Quitte le parking </q-tooltip></q-btn
                >
              </q-card-actions>
            </q-card>
          </div>
        </div>
        <!--   Vehicules quittant le parking -->
        <div class="col-4 q-px-xs">
          <div class="q-pa-xs column-background">
            <q-item class="q-pa-none text-white q-pa-sm done-title">
              <q-item-section avatar style="min-width: 25px">
                <q-icon name="exit_to_app" class="q-pa-none q-ma-none" />
              </q-item-section>
              <q-item-section class="text-h6 text-weight-bolder"
                >Sont Partis</q-item-section
              >
              <q-item-section avatar>
                <q-icon name="more_vert" class="cursor-pointer">
                  <q-menu transition-show="rotate" transition-hide="rotate">
                    <q-list style="min-width: 100px">
                      <q-item clickable>
                        <q-item-section>Aujoud'hui</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>A la date du</q-item-section>
                      </q-item>
                      <q-item clickable>
                        <q-item-section>Toutes</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-icon>
              </q-item-section>
            </q-item>

            <q-card
              square
              v-for="(element, sortis_index) in visiteursParking_sortis"
              v-bind:key="sortis_index"
              flat
              bordered
              class="box-shadow bg-white q-mt-xs list-group-item border-test"
              :style="
                element.etat == 'sortie'
                  ? 'border-left: 5px solid red !important'
                  : ''
              "
            >
              <q-toolbar
                class="bg-transparent text-dark q-pa-none"
                style="min-height: 10px"
              >
                <q-btn flat round dense icon="event" color="green" />
                <q-separator dark vertical inset />
                <q-toolbar-title class="text-caption">
                  <span class="text-bold">Le : </span
                  ><span class="text-h6"
                    ><span class="text-green text-bold text-h5">{{
                      element.datesortie
                    }}</span>
                    à
                    <span class="text-red text-bold text-h5">{{
                      element.heuresortie
                    }}</span></span
                  >
                </q-toolbar-title>
                <!--<q-btn flat round dense icon="apps" class="q-mr-xs" />-->
                <q-btn
                  flat
                  round
                  dense
                  icon="close"
                  @click="
                    deleteDemande('visiteursParking_sortis', sortis_index)
                  "
                />
              </q-toolbar>
              <q-card-section class="q-pt-xs">
                <div class="row items-center no-wrap">
                  <div class="col">
                    <div class="text-center">
                      <span class="text-bold">Immatriculation : </span>
                      <span class="text-bold text-h5">{{
                        element.immatriculation
                      }}</span>
                    </div>
                    <div class="text-caption">
                      <q-icon name="assignment_ind" size="3vh" />
                      <span class="text-bold">Demandeur :</span>
                      <span>
                        {{ element.contactinterne }}
                      </span>
                    </div>
                    <div>
                      <span class="text-bold">Occupants : </span
                      >{{ getNbPassagers(element.passagers) }}
                    </div>
                    <q-chip
                      color="primary"
                      text-color="white"
                      icon="directions_car"
                      Ice
                      cream
                      v-for="(elt, index) in element.passagers"
                      :key="`at_passager_${index}`"
                    >
                      <q-separator
                        dark
                        vertical
                        inset
                        class="q-my-none q-mx-sm"
                      />&nbsp;
                      <span>
                        {{ elt.nom }} {{ elt.prenom }}&nbsp;&nbsp;&nbsp;</span
                      >
                      <!--<span class="text-bold q-px-md">
                        <q-icon name="warehouse" size="2vh" />
                      </span>-->
                      <q-separator
                        dark
                        vertical
                        inset
                        class="q-my-none q-mx-sm"
                      />&nbsp;
                      <span> Société : {{ elt.societe }}</span>
                    </q-chip>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="right" class="q-pa-none">
                <q-btn
                  size="md"
                  flat
                  round
                  color="blue"
                  icon="speaker_notes"
                  @click="showDiagDetail(element)"
                >
                  <q-tooltip>Commentaires</q-tooltip>
                </q-btn>
                <!--<q-btn size="xs" dense filled round color="orange" icon="flag"/>showDiagPassagers(element.passagers)
                <q-btn
                  size="md"
                  flat
                  color="primary"
                  icon="logout"
                  @click="sortieParking('visiteursParking_au_parking', sortis_index)"
                  ><q-tooltip> Quitte le parking </q-tooltip></q-btn>-->
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <!--<div class="container full-width">
          <f-vv-table
            :datas="visiteursParking"
            :headers_filter="true"
          ></f-vv-table>
        </div>-->
      <q-dialog v-model="showAddParking" position="left">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">Arrive au parking</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <q-form class="q-gutter-md full-width">
              <q-input
                filled
                v-model="immatriculation"
                mask="XX-XXX-XX"
                :rules="[
                  (val) =>
                    new RegExp(/^[A-Z]{2} ?- ?\d{3} ?- ?[A-Z]{2}$/).test(val) ||
                    'Immatriculation non valide',
                ]"
                fill-mask
                label="Immatriculation"
                class="q-ml-none"
              />

              <!--<q-input filled v-model="task_item.task_type" label="Last Name" class="q-ml-none"/>-->

              <div class="text-right">
                <q-btn label="Annuler" v-close-popup color="primary" />
                <q-btn
                  @click="addParkingChanges"
                  style="width: 90px"
                  class="q-ml-sm"
                  label="Ajouter"
                  color="green"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showAddVehiculeParking" position="left">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6">Nouveau Véhicule au parking</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <q-form class="q-gutter-md full-width">
              <q-input
                filled
                v-model="immatriculation"
                mask="XX-XXX-XX"
                :rules="[
                  (val) =>
                    new RegExp(/^[A-Z]{2} ?- ?\d{3} ?- ?[A-Z]{2}$/).test(val) ||
                    'Immatriculation non valide',
                ]"
                fill-mask
                label="Immatriculation"
                class="q-ml-none"
              />

              <!--<q-input filled v-model="task_item.task_type" label="Last Name" class="q-ml-none"/>-->

              <div class="text-right">
                <q-btn label="Annuler" v-close-popup color="primary" />
                <q-btn
                  @click="addVehiculeParkingChanges"
                  style="width: 90px"
                  class="q-ml-sm"
                  label="Ajouter"
                  color="green"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showDelete" position="top">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirmer vous cette suppression ?
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <q-form class="q-gutter-md full-width">
              <div class="text-right q-gutter-md">
                <q-btn
                  @click="showDelete = false"
                  label="NON"
                  color="primary"
                  icon="cancel"
                />
                <q-btn
                  @click="confirmDelete"
                  label="OUI"
                  icon="done"
                  color="green"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showSortie" position="top">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6 text-center">
              Confirmer vous cette sortie de véhicule ?
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <q-form class="q-gutter-md full-width">
              <div class="text-right q-gutter-md">
                <q-btn
                  @click="showSortie = false"
                  label="NON"
                  color="primary"
                  icon="cancel"
                />
                <q-btn
                  @click="confirmSortie"
                  label="OUI"
                  icon="done"
                  color="green"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog
        v-model="showDetails"
        persistent
        transition-show="flip-down"
        transition-hide="flip-up"
      >
        <q-card class="container row full-width">
          <q-toolbar>
            <q-img
              rounded
              src="~assets/cacem.png"
              style="height: 35px; max-width: 120px"
            />

            <q-toolbar-title
              ><span class="text-weight-bold">
                Détails de la demande parking</span
              ></q-toolbar-title
            >

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <f-vv-form-by-name
              :fieldsmodel="currentDemande"
              :nameForm="'Demande Parking'"
              :showSave="true"
              :saveLabel="'Modifier'"
              @onFormAdded="editFormDatas"
            ></f-vv-form-by-name>
          </q-card-section>
        </q-card>
      </q-dialog>
      <!---------------------->
      <q-dialog
        v-model="showNewParking"
        persistent
        transition-show="flip-down"
        transition-hide="flip-up"
      >
        <q-card class="container row full-width">
          <!--<q-card-section>
            <div class="text-h6 text-center">Ajouter au parking</div>
          </q-card-section>-->
          <q-toolbar>
            <q-img
              rounded
              src="~assets/cacem.png"
              style="height: 35px; max-width: 120px"
            />

            <q-toolbar-title
              ><span class="text-weight-bold"
                >Ajouter au parking</span
              ></q-toolbar-title
            >

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-separator />
          <q-card-section class="row items-center no-wrap">
            <f-vv-form-by-name
              :fieldsmodel="{
                chargeaccueil: currentUsername,
                typeacces: 'PARKING',
                etat: 'attente',
              }"
              :nameForm="'Demande Parking'"
              :showSave="true"
              :saveLabel="'Ajouter'"
              @onFormAdded="editFormDatas"
            ></f-vv-form-by-name>
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showSendMail" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-icon size="5vh" name="done" color="secondary" />
            <span class="q-ml-sm"
              >Un E-mail de confirmation à été envoyé aux administrateurs</span
            >
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Fermer"
              color="primary"
              @click="showSendMail = false"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-pull-to-refresh>
  </q-page>
</template>

<script>
import filter from '@mozeyinedu/filter';

import Vue from 'vue';

import { mapState, mapActions } from 'vuex';

import { colors, QSpinnerGears, QSpinnerPie } from 'quasar';

import draggable from 'vuedraggable';

import { Notify, date } from 'quasar';

import queryable from 'query-objects';

import FVvFormByName from '../components/FVvFormByName.vue';
import FVvTable from '../components/FVvTable.vue';

Vue.component('draggable', draggable);

export default {
  components: { FVvFormByName, FVvTable },
  name: 'ReservationsParking',
  data() {
    const myLocale = {
      /* starting with Sunday */
      days: 'Dimanche_Lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
      daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
      months:
        'Janvier_Février_Mars_Avril_Mai_Juin_Juillet_Aôut_Septembre_Octobre_Novembre_Décembre'.split(
          '_'
        ),
      monthsShort: 'Jan_Fév_Mar_Avr_Mai_Jun_Jui_Aou_Sep_Oct_Nov_Déc'.split('_'),
      firstDayOfWeek: 0,
    };
    return {
      search: '',
      searchValue: '',
      filters: {},
      fromCol: null,
      toCol: null,
      carToAdd: null,
      carToAddV: null,
      fSelect: '',
      vparking: [],
      sparking: [],
      demandeType: '',
      deleteObj: {},
      sortieObj: {},
      getValue: (value) =>
        typeof value === 'string' ? value.toUpperCase() : value,
      datevisiteFiltre: false,
      isFilterDatejour: false,
      isFilterDateAll: false,
      //visiteursParking: [],
      filteredParking: [],
      showAddParking: false,
      showAddVehiculeParking: false,
      showNewParking: false,
      showSortie: false,
      showDelete: false,
      showDetails: false,
      showPassagers: false,
      showSendMail: false,
      currentDemande: {},
      currentCarIndex: null,
      filters: {},
      customFilter: null,
      changes: [],
      deleteCar: [],
      deleteCarIndex: null,
      deleteCarId: null,
      immatriculation: '',
      datedujour: date.formatDate(Date.now(), 'DD/MM/YYYY'),
      heuredujour: date.formatDate(Date.now(), 'HH:mm'),
      myLocale: myLocale,
      add_new: false,
      drag: false,
    };
  },
  computed: {
    currentUsername() {
      console.log('Root :', this.$store);
      return this.$store.state.auth.user.sAMAccountName;
    },
    usermail() {
      if (!this.$store.state.auth.user.mail) return;
      return this.$store.state.auth.user.mail;
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
    ...mapState('admin', {
      formData: (state) => state.getform,
      fconfig: (state) => state.config,
      visiteurs: (state) => state.visiteurs,
      vParking: (state) => state.visiteursParking,
    }),
    getFilters() {
      return this.filters;
    },

    totalVisiteurs() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      return this.visiteursParking.filter(
        (elt) => elt.datevisite == this.datedujour && elt.etat == 'parking'
      ).length;
    },
    totalRdcVisiteurs() {
      if (!this.visiteurs || !Array.isArray(this.visiteurs)) return;
      return this.visiteurs.filter(
        (elt) => elt.datevisite == this.datedujour && elt.typeacces == 'RDC'
      ).length;
    },
    totalParkingVisiteurs() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      return this.visiteursParking.filter(
        (elt) =>
          elt.datevisite == this.datedujour &&
          elt.typeacces == 'PARKING' &&
          elt.etat == 'parking'
      ).length;
    },
    visiteursParking_en_attente() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      console.log('Visiteurs en attente :',this.visiteursParking)
      return this.visiteursParking
          .filter((elt) => elt.etat == 'attente')
          .sort((a, b) => {
            var dateA = a.heurevisite; //new Date(a.date_prop).getTime();
            var dateB = b.heurevisite; //new Date(b.date_prop).getTime();
            return dateA < dateB ? -1 : 1; // ? -1 : 1 for ascending/increasing order
          })
    },
    visiteursParking_reserve() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      return this.visiteursParking.filter(
        (elt) => elt.typeacces == 'PARKING' && elt.etat == 'reserve'
      );
    },
    visiteursParking_sortis() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      return this.visiteursParking
        .filter((elt) => elt.typeacces == 'PARKING' && elt.etat == 'sortie')
        .sort((a, b) => {
          var dateA = a.heuresortie; //new Date(a.date_prop).getTime();
          var dateB = b.heuresortie; //new Date(b.date_prop).getTime();
          return dateA < dateB ? -1 : 1; // ? -1 : 1 for ascending/increasing order
        });
    },
    visiteursParking_au_parking() {
      if (!this.visiteursParking || !Array.isArray(this.visiteursParking))
        return;
      return this.visiteursParking.filter(
        (elt) => elt.typeacces == 'PARKING' && elt.etat == 'parking'
      );
    },
    visiteursParking() {
      /*if (this.searchValue) {
        return this.filteredParking;
      } else*/
      /*if ((this.searchValue && (this.searchValue.length > 0))) {
        return this.customFilter;
      }  else if (Object.keys(this.getFilters).length > 0) {
        return this.customFilter;
      } else {
        return this.vParking;//this.customFilter;
      }*/
      if (this.customFilter) {
        return this.customFilter;
      } else {
        return this.vParking;
      }
    },
    showDev() {
      return process.env.NODE_ENV!='production'
    }
  },
  methods: {
    ...mapActions('admin', [
      'getAllVisiteurs',
      'addVisiteur',
      'addDatasForm',
      'updateDatasForm',
      'deleteDatasForm',
      'getForm',
      'getFormByName',
      'saveForm',
      'getConfig',
      'writeConfig',
      'sendMail',
    ]),

    globalSearch(arrayobj, text) {
      const filteredData = arrayobj.filter((data) => {
        return Object.keys(data).some((key) => {
          console.log('filtrer :', typeof data[key]);

          return JSON.stringify(data[key])
            .toLocaleLowerCase()
            .trim()
            .includes(text);
        }); // return Object.values(data).some(valo=> valo.toLowerCase().indexOf(val.toLowerCase()) !== -1)
      });

      console.log('Recherche v:', filteredData);
      return filteredData;
    },
    doSearch(val) {
      const memVisiteurs = this.filterArray(this.vParking, this.filters);
      if (String(val).trim().length > 0) {
        console.log('Nb filtres :', Object.keys(this.filters).length);

        this.customFilter = Object.assign(
          [],
          filter({
            data: memVisiteurs,
            keys: [
              'nom',
              'prenom',
              'contactinterne',
              'societe',
              'motif',
              'motifautre',
              'commentaires',
            ],
            input: val,
          })
        );

        console.log('Recherche result:', this.customFilter);
        //this.refresh();
      } else {
        /*this.customFilter =  filter({
          data: memVisiteurs,
          keys: [ 'nom','prenom','contactinterne','societe','motif','motifautre','commentaires' ],
          input: '',
        });*/
        //this.customFilter = this.filterArray(this.vParking, this.filters);
        this.refresh();
      }

      //this.refresh();
    },
    /**
     * Filters an array of objects using custom predicates.
     *
     * @param  {Array}  array: the array to filter
     * @param  {Object} filters: an object with the filter criteria
     * @return {Array}
     */
    filterArray(array, filters) {
      const filterKeys = Object.keys(filters);
      return array.filter((item) => {
        // validates all filter criteria
        return filterKeys.every((key) => {
          // ignores non-function predicates
          if (typeof filters[key] !== 'function') return true;
          return filters[key](item[key]);
        });
      });
    },
    multiFilter(objectData, combinations, input) {
      // store the filtered results in : "const result"
      const result = objectData.filter((data) => {
        // initialize a variable to store combos in : "let combinationQueries = ""
        let combinationQueries = '';

        // loop over the combo values paseed by users
        combinations.forEach((arg) => {
          // first check if the current combo value exists in the object then ...
          // add them together
          combinationQueries +=
            data.hasOwnProperty(arg) && data[arg].toLowerCase().trim() + ' ';
        });
        /*
        loop over current "Object keys" and return the first
        successful search match (".some()" at work here)
         */
        return Object.keys(data).some((key) => {
          /**
           * return first successful search query match but...
           * do not return if value is "undefined", "null", false, true,  and...
           * trim values to remove trailing whitespaces
           */
          return (
            (data[key] !== undefined &&
              data[key] !== null &&
              /**
               * activate/uncomment the feature/code below if you don't wanna filter by boolean values
               * e.g isActive fields, or isActivated fields
               */
              // data[key] !== false && data[key] !== true &&
              JSON.stringify(data[key]).toLowerCase().trim().includes(input)) ||
            combinationQueries.trim().includes(input)
          );
        });
      });
      // function to recieve the result of the search query data
      return result;
    },
    /**
     * Filters an array of objects (one level-depth) with multiple criteria.
     *
     * @param  {Array}  array: the array to filter
     * @param  {Object} filters: an object with the filter criteria
     * @return {Array}
     */
    filterPlainArray(array, filters) {
      const filterKeys = Object.keys(filters);
      return array.filter((item) => {
        // validates all filter criteria
        return filterKeys.every((key) => {
          // ignores an empty filter
          if (!filters[key].length) return true;
          return filters[key].find(
            (filter) => this.getValue(filter) === this.getValue(item[key])
          );
        });
      });
    },
    doFind(oarray, filter) {
      const result = oarray.filter((el) =>
        filters.some((filterEl) => el[filterEl.type] === filterEl.name)
      );
      return result;
    },
    /**
     *
     */
    ifJSON(field) {
      try {
        if (
          Object.prototype.toString.call(field) === '[object Object]' ||
          Array.isArray(field)
        ) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    },
    whereDateYearEq(annee) {
      return (item) => item.split('/')[2] === annee;
    },
    whereDateMonthrEq(mois) {
      return (item) => item.split('/')[1] === mois;
    },
    whereDateDayEq(jour) {
      return (item) => item.split('/')[0] === jour;
    },
    whereContain(search) {
      return (item) =>
        String(item).toLowerCase().includes(search.toLowerCase()); //indexOf(search.toLowerCase()) != -1;
    },
    whereValue(value) {
      return (item) =>
        JSON.stringify(item).toLowerCase().trim().includes(value);
    },
    whereDateBetween(date1, date2) {
      return (item) =>
        date.isBetweenDates(
          new Date(item.split('/')[2], item.split('/')[1], item.split('/')[0]),
          new Date(
            date1.split('/')[2],
            date1.split('/')[1],
            date1.split('/')[0]
          ),
          new Date(
            date2.split('/')[2],
            date2.split('/')[1],
            date2.split('/')[0]
          ),
          { onlyDate: true, inclusiveFrom: true, inclusiveTo: true }
        );
    },
    whereDateDuJour(datej) {
      let cdate = new Date(
        datej.split('/')[2],
        datej.split('/')[1],
        datej.split('/')[0]
      );
      return (item) =>
        date.isSameDate(
          new Date(item.split('/')[2], item.split('/')[1], item.split('/')[0]),
          cdate
        );
    },
    whereTypeAcces(acces) {
      return (item) => String(item).trim() == acces;
    },
    filterColumn(val) {
      console.log('Filter data :', ['contactinterne', 'nom']);
      console.log('Value :', val);
      console.log(
        'Donnees :',
        this.vParking.filter(
          (row) =>
            String(row[Object.keys(['contactinterne', 'nom'])[0]]).indexOf(
              val
            ) != -1
        )
      );
      const fdata = Object.entries(['contactinterne', 'nom']).map(
        ([key, value]) => ({
          key,
          value,
        })
      );
      console.log('Donnees :', fdata);
      fdata.forEach((elt) => {
        this.filters[elt.key] = this.whereContain(elt.value);
      });
      this.customFilter = this.filterArray(this.vParking, this.filters);

      // Object.assign([],this.ldata.filter(row => this.filter_data.every(val => String(row[Object.keys(this.filter_data)[0]]).indexOf(val)!=-1)))
    },
    /**
     *  delete filter
     */
    deleteFilters(objScope, headerToFiltre) {
      this.filters[`${headerToFiltre}`] = '';
      this.customFilter = this.filterArray(this.vParking, this.filters);
      this.filtersParams[`${headerToFiltre}`].value = '';
      //this.$refs[`filter_${headerToFiltre}`].cancel()
      objScope.set();
    },

    async addParkingChanges() {
      if (this.immatriculation != '') {
        console.log('Parking Liste :', this.visiteursParking);
        console.log('Element Index :', this.currentCarIndex);
        this.changes = [];

        this.carToAdd.immatriculation = this.immatriculation;
        this.carToAdd.etat = 'parking';
        this.carToAdd.heureparking = this.heuredujour;
        this.carToAdd.dateparking = this.datedujour;
        this.carToAdd.typeacces = 'PARKING';
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        let db = 'db_regvisiteurs';
        let table = 'dbf_accueil';
        await this.updateDatasForm({
          fields: this.carToAdd,
          dbname: db,
          tablename: table,
        });

        console.log('Mise à jour effectuée');
        await this.getFormByName('Demande d\'accès Parking');
        console.log('Champs du formulaire :', this.formData);
        let msgMail = this.formData[0].data
          .filter(
            (o) =>
              Object(o).hasOwnProperty('id') &&
              Object(o).hasOwnProperty('label')
          )
          .map((elt) => {
            if (this.carToAdd[elt.id]) {
              if (Array.isArray(this.carToAdd[elt.id])) {
                return (
                  `<b>${elt.label} : </b><br>` +
                  this.carToAdd[elt.id]
                    .map((elt) =>
                      Object.entries(elt)
                        .map(([key, val]) => `<b>${key} :</b>${val}<br>`)
                        .join('')
                    )
                    .join('')
                );
              } else {
                return `<b>${elt.label} : </b>${this.carToAdd[elt.id]}<br>`;
              }
            } else {
              return '<br>';
            }
          })
          .join('');
        msgMail =
          msgMail +
          `<br><b>Immatriculation : </b>${this.carToAdd['immatriculation']}<br>`;
        msgMail =
          msgMail +
          `<br><b>Date au parking : </b>${this.carToAdd['dateparking']}<br>`;
        msgMail =
          msgMail +
          `<br><b>Heure au parking : </b>${this.carToAdd['heureparking']}<br>`;
        let usermail = this.$store.state.auth.user.mail;

        //pascal.deleray@cacem-mq.com,
        const regex = /\((.*)\)/gm;
        let contact = regex.exec(this.carToAdd['contactinterne'])[1];
        console.log('Envoi au contact interne :', contact);
        console.log('Envoi au utilisateur :', usermail);

        let objMail = {
          to: `pascal.deleray@cacem-mq.com,,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,${usermail},${contact}`,
          subject: `Nouveau Véhicule au Parking`,
          message: `${msgMail}`,
        };
        if (process.env.NODE_ENV != 'production') {
          objMail = {
            to: `admindsi@cacem-mq.com,${contact}`,
            subject: `** Developpement ** Nouveau Véhicule au Parking`,
            message: `${msgMail}`,
          };
        }

        await this.sendMail(objMail);
        this.$q.loading.hide();
        this.showConfirm = false;
        //sendMail
        this.showSendMail = true;

        await this.refresh();
        this.showAddParking = false;
        this.immatriculation = '';
      }
    },
    async addVehiculeParkingChanges() {
      if (this.immatriculation != '') {
        console.log('Parking Liste :', this.visiteursParking);
        console.log('Element Index :', this.currentCarIndex);
        this.changes = [];

        this.carToAddV.immatriculation = this.immatriculation;
        this.carToAddV.etat = 'parking';
        this.carToAddV.heureparking = this.heuredujour;
        this.carToAddV.dateparking = this.datedujour;
        this.carToAddV.typeacces = 'PARKING';
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        let db = 'db_regvisiteurs';
        let table = 'dbf_accueil';
        delete this.carToAddV._id;
        console.log('Fields to add :', this.carToAddV);
        await this.addDatasForm({
          fields: this.carToAddV,
          dbname: db,
          tablename: table,
        });

        console.log('Mise à jour effectuée');
        await this.getFormByName('Demande d\'accès Parking');
        console.log('Champs du formulaire :', this.formData);
        let msgMail = this.formData[0].data
          .filter(
            (o) =>
              Object(o).hasOwnProperty('id') &&
              Object(o).hasOwnProperty('label')
          )
          .map((elt) => {
            if (this.carToAddV[elt.id]) {
              if (Array.isArray(this.carToAddV[elt.id])) {
                return (
                  `<b>${elt.label} : </b><br>` +
                  this.carToAdd[elt.id]
                    .map((elt) =>
                      Object.entries(elt)
                        .map(([key, val]) => `<b>${key} :</b>${val}<br>`)
                        .join('')
                    )
                    .join('')
                );
              } else {
                return `<b>${elt.label} : </b>${this.carToAddV[elt.id]}<br>`;
              }
            } else {
              return '<br>';
            }
          })
          .join('');
        msgMail =
          msgMail +
          `<br><b>Immatriculation : </b>${this.carToAddV['immatriculation']}<br>`;
        msgMail =
          msgMail +
          `<br><b>Date au parking : </b>${this.carToAddV['dateparking']}<br>`;
        msgMail =
          msgMail +
          `<br><b>Heure au parking : </b>${this.carToAddV['heureparking']}<br>`;
        let usermail = this.$store.state.auth.user.mail;

        //pascal.deleray@cacem-mq.com,
        const regex = /\((.*)\)/gm;
        let contact = regex.exec(this.carToAddV['contactinterne'])[1];
        console.log('Envoi au contact interne :', contact);
        console.log('Envoi au utilisateur :', usermail);

        let objMail = {
          to: `pascal.deleray@cacem-mq.com,,parcauto@cacem.fr,alex.hibade@cacem-mq.com,admindsi@cacem-mq.com,${usermail},${contact}`,
          subject: `Nouveau Véhicule au Parking`,
          message: `${msgMail}`,
        };
        if (process.env.NODE_ENV != 'production') {
          objMail = {
            to: `admindsi@cacem-mq.com,${contact}`,
            subject: `** Developpement ** Nouveau Véhicule au Parking`,
            message: `${msgMail}`,
          };
        }

        await this.sendMail(objMail);
        this.$q.loading.hide();
        this.showConfirm = false;
        //sendMail
        this.showSendMail = true;

        await this.refresh();
        this.showAddVehiculeParking = false;
        this.immatriculation = '';
      }
    },
    getNbPassagers(p) {
      //const p = Object.assign([],passagers)
      if (p && Array.isArray(p)) {
        return p.length;
      } else {
        return 0;
      }
    },
    getPassagers(p) {
      let pp = [];
      for (let index = 0; Array(p).length; index++) {
        const element = p[index];

        pp.push({ nom: element.nom, prenom: element.prenom });
      }
      console.log('Passagers :', pp);
      return pp;
    },

    deleteDemande(demandeParking, index) {
      console.log('Demande parking à supprimer type :', demandeParking);
      this.demandeType = demandeParking;
      console.log(
        'demande reelle à supprimer id :',
        this[demandeParking][index]._id
      );

      this.deleteCarId = this[demandeParking][index]._id;
      this.deleteObj = Object.assign({}, this[demandeParking][index]);
      console.log('Demande parking à annuler :', this.deleteObj);
      this.showDelete = true;
      this.deleteCar = this[demandeParking];
      this.deleteCarIndex = index;
    },
    async confirmDelete() {
      //this.deleteCar.splice(this.deleteCarIndex, 1);
      if (this.demandeType == 'visiteursParking_en_attente') {
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        const db = 'db_regvisiteurs';
        const table = 'dbf_accueil';
        //this.deleteObj.etat = 'efface'
        await this.deleteDatasForm({
          id: this.deleteObj._id,
          dbname: db,
          tablename: table,
        });
        await this.refresh();
        this.$q.loading.hide();
      }

      if (this.demandeType == 'visiteursParking_au_parking') {
        console.log('Au parking A supprimer :', this.deleteObj);

        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        const db = 'db_regvisiteurs';
        const table = 'dbf_accueil';
        this.deleteObj.etat = 'attente';
        await this.updateDatasForm({
          fields: this.deleteObj,
          dbname: db,
          tablename: table,
        });
        await this.refresh();
        this.$q.loading.hide();
      }

      if (this.demandeType == 'visiteursParking_sortis') {
        console.log('A supprimer :', this.deleteObj);

        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        const db = 'db_regvisiteurs';
        const table = 'dbf_accueil';
        this.deleteObj.etat = 'efface';
        this.deleteObj.heuredelete = this.heuredujour;
        this.deleteObj.datedelete = this.datedujour;
        await this.updateDatasForm({
          fields: this.deleteObj,
          dbname: db,
          tablename: table,
        });
        await this.refresh();
        this.$q.loading.hide();
      }

      this.showDelete = false;
    },
    sortieParking(demandeParking, index) {
      console.log('Demande parking à supprimer type :', demandeParking);
      this.demandeType = demandeParking;
      console.log('demande  à supprimer id :', this[demandeParking][index]._id);

      this.deleteCarId = this[demandeParking][index]._id;
      this.sortieObj = Object.assign({}, this[demandeParking][index]);
      this.showSortie = true;
      this.deleteCar = this[demandeParking];
      this.deleteCarIndex = index;
    },
    async confirmSortie() {
      //this.deleteCar.splice(this.deleteCarIndex, 1);

      if (this.demandeType == 'visiteursParking_au_parking') {
        console.log('A sortir du parking :', this.sortieObj);
        this.sortieObj.etat = 'sortie';
        this.sortieObj.heuresortie = this.heuredujour;
        this.sortieObj.datesortie = this.datedujour;
        this.$q.loading.show({
          spinner: QSpinnerGears,
          spinnerColor: 'red',
          message: 'Chargement en cours...',
        });
        const db = 'db_regvisiteurs';
        const table = 'dbf_accueil';
        await this.updateDatasForm({
          fields: this.sortieObj,
          dbname: db,
          tablename: table,
        });
        await this.refresh();
        this.$q.loading.hide();
      }

      this.showSortie = false;
    },
    showDiagDetail(infos) {
      this.currentDemande = Object.assign({}, infos);
      this.showDetails = true;
    },
    showDiagVehicule(infos) {
      this.currentDemande = Object.assign({}, infos);
      this.showAddVehiculeParking = true;
    },
    showDiagPassagers(pinfos) {
      this.currentPassagers = Object.assign({}, pinfos);
      this.showPassagers = true;
    },
    editFormDatas(fields) {
      console.log('Données à modifier :', fields);
      this.showDetails = false;
    },
    async refresh(done) {
      /*setTimeout(() => {
        this.items.push({}, {}, {}, {}, {}, {}, {})
        done()
      }, 1000)*/
      this.$q.loading.show({
        spinner: QSpinnerGears,
        spinnerColor: 'red',
        message: 'Chargement en cours...',
      });
      await this.getAllVisiteurs();
      this.customFilter = this.filterArray(this.vParking, this.filters);
      this.$q.loading.hide();
      try {
        done();
      } catch (error) {}
    },
    toggle() {
      const target = e.target; //.parentNode.parentNode.parentNode

      this.$q.fullscreen
        .toggle(target)
        .then(() => {
          // success!
        })
        .catch((err) => {
          alert(err);
          // uh, oh, error!!
          // console.error(err)
        });
    },
    filtreDateDuJour() {
      this.searchValue = '';
      this.filters[`datevisite`] = this.whereDateDuJour(this.datedujour);
      this.customFilter = this.filterArray(this.vParking, this.filters);
      console.log(`Filtres ${this.datedujour}:`, this.filters);
      this.isFilterDatejour = true;
      this.isFilterDateAll = false;
      //this.$ref.chkDatej.toggle();
    },
    filtreDateAll() {
      this.searchValue = '';
      this.filters[`datevisite`] = '';
      this.customFilter = this.filterArray(this.vParking, this.filters);
      console.log('Filtres tout :', this.filters);
      this.isFilterDateAll = true;
      this.isFilterDatejour = false;
    },
  },

  async mount() {
    console.log('Les visiteurs parking:', this.visiteursParking);
    console.log('Search value :', this.searchValue);
  },
  async beforeMount() {
    this.$q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'red',
      message: 'Chargement en cours...',
    });
    await this.getAllVisiteurs();
    this.filters[`datevisite`] = this.whereDateDuJour(this.datedujour);
    this.customFilter = this.filterArray(this.vParking, this.filters);
    console.log('Filtres :', this.filters);
    this.datevisiteFiltre = Object.keys(this.filters).includes('datevisite');
    console.log('Filters properties :', this.datevisiteFiltre);
    console.log('Filtre custom result :', this.customFilter);
    this.isFilterDatejour = true;
    this.$q.loading.hide();
  },
};
</script>

<style scoped>
.button {
  margin-top: 35px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 100vh;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

.cursor-move {
  cursor: move;
}

.border-todo {
  border-left: 5px solid #2fbb91 !important;
}

.feature-to-do {
  background-color: #2fbb91;
}

.to-do-title {
  background-color: rgb(47, 187, 145);
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.border-in-progress {
  border-left: 5px solid #ee9835 !important;
}

.feature-in-progress {
  background-color: #ee9835;
}

.in-progress-title {
  background-color: #ee9835;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.border-test {
  border-left: 5px solid blueviolet !important;
}

.feature-test {
  background-color: blueviolet;
}

.test-title {
  background-color: blueviolet;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.border-done {
  border-left: 5px solid green !important;
}

.feature-done {
  background-color: green;
}

.done-title {
  background-color: green;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}

.to-do-title {
  background-color: rgb(47, 187, 145);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.bottom-right-radius {
  border-bottom-right-radius: 4px !important;
}

.tag-badge {
  border: 1px solid currentColor !important;
  border-radius: 4px !important;
}

.bug {
  background-color: red;
}

.box-shadow:hover {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14),
    0 1px 10px rgba(0, 0, 0, 0.12) !important;
}
.q-dialog__inner--minimized > div {
  max-width: calc(100vh - 48px);
}
</style>
