<template>
  <div id="status">
    <template>
      <h1 id="title">{{ $t('Egesamt') }} <span id="all">0</span>, {{ $t('Eneu') }} <span id="all-new">0</span>, <span name="1900-01-01" id="all-date">???</span></h1>
      <div id='inhalt'></div>
    </template>
  </div>
</template>

<style lang="scss">
#status dl {
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  text-align: left
}
#status dt {
  float: left;
  width: 10%;
  /* adjust the width; make sure the total of both is 100% */
  padding: 0;
  margin: 0;
  text-align: left
}
#status dd {
  float: left;
  width: 90%;
  /* adjust the width; make sure the total of both is 100% */
  padding: 0;
  margin: 0;
  text-align: left
}
</style>

<script>

</script>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Status'
})

export default class Status extends Vue {
  mounted () {
    let flag = 0

    function setCount (eintrag, gesamtzahl, neu, changed, entfernt, datum, text) {
      // alert(eintrag+" gesamt: "+gesamtzahl.toString()+", neu: "+neu.toString()+", geändert: "+changed.toString()+", entfernt: "+entfernt.toString());
      const gesamtzahlE = document.getElementById(eintrag)
      if (gesamtzahlE) {
        gesamtzahlE.innerHTML = (gesamtzahl + parseInt(gesamtzahlE.innerHTML, 10)).toString()
        const neuE = document.getElementById(eintrag + '-new')
        if (neuE) neuE.innerHTML = (neu + parseInt(neuE.innerHTML, 10)).toString()
        const datumE = document.getElementById(eintrag + '-date')
        if (datumE !== null) {
          let name = datumE.getAttribute('name')
          if (name !== null && name.localeCompare(datum) < 0) {
            datumE.setAttribute('name', datum)
            datumE.innerHTML = text
            // const changed_e=document.getElementById("changed");
            // changed_e.innerHTML=(changed+parseInt(changed_e.innerHTML,10)).toString();
            // const entfernt_e=document.getElementById("entfernt");
            // entfernt_e.innerHTML=(entfernt+parseInt(entfernt_e.innerHTML,10)).toString();
          }
        }
        return true
      } else {
        return false
      }
    }

    function setInfo (eintrag, text) {
      const element = document.getElementById(eintrag)
      if (element != null) element.innerHTML = text
    }

    function setzeInfoString (dict, eintrag, text, jobtyp, datum, zusatz, thist) {
      let subtext = ''
      const gesamt = 0
      let neu = 0
      let changed = 0
      let entfernt = 0
      if ('gesamt' in dict) {
        const gesamtzahl = dict.gesamt
        if ('aktuell_neu' in dict) {
          subtext = thist.$t('neu:') + ' ' + dict.aktuell_neu
          neu = dict.aktuell_neu
        }
        if ('aktuell_aktualisiert' in dict) {
          if (subtext !== '') subtext += ', '
          subtext += thist.$t('aktualisiert:') + ' ' + dict.aktuell_aktualisiert
          changed = dict.aktuell_aktualisiert
        }
        if ('aktuell_entfernt' in dict) {
          if (subtext !== '') {
            subtext += ', '
          }
          subtext += thist.$t('entfernt:') + ' ' + dict.aktuell_entfernt
          entfernt = dict.aktuell_entfernt
        }
        if (subtext === '') {
          subtext = thist.$t('keine aktuelle Änderung')
        }
        if (subtext !== '') subtext = ', <small>' + subtext + '</small>'
        // setInfo(eintrag + '-date', ' ' + text + subtext)
        // setInfo(eintrag, gesamtzahl)
        // Wenn es keine Kammer gibt, dann das Verzeichnis auf Gerichtsebene anzeigen.
        let zusatz2 = ''
        if (! setCount(eintrag, gesamtzahl, neu, changed, entfernt, datum, text + zusatz)) {
          zusatz2 = zusatz
        }
        if (eintrag.substring(0, 7) !== 'Spider-') {
          setCount('all', gesamtzahl, neu, changed, entfernt, datum, text)
          const teile = eintrag.split('_')
          if (teile.length === 3) {
            setCount(teile[0], gesamtzahl, neu, changed, entfernt, datum, text)
            setCount(teile[0] + '_' + teile[1], gesamtzahl, neu, changed, entfernt, datum, text + zusatz2)
          }
        }
      }
    }

    function eintragen (data, spider, signaturen, thist) {
      let text = '<small>'
      let jobtyp = 'update'
      let gesamt = { gesamt: 0 }
      let datum = '1901'
      if (data.job === 'nojob') {
        text += thist.$t('kein Lauf vorhanden')+'</small>'
        jobtyp = 'noch nicht gelaufen'
      } else {
        if ('jobtyp' in data) jobtyp = data.jobtyp
        if (jobtyp === 'komplett') text += thist.$t('Komplett gelesen am')+' '
        else if (jobtyp == 'neu') text += thist.$t('Neu gelesen am')+' '
        else text += thist.$t('Update am')+' '
        text += data.time + ' (UTC)</small>'
        if ('gesamt' in data && 'gesamt' in data.gesamt) gesamt = data.gesamt
        datum = data.time
      }
      let zusatz = ''
      if ('signaturen' in data) zusatz = ' <a href="https://entscheidsuche.ch/docs/' + spider + '/" title="Verzeichnis mit den Urteilen öffnen"><img src="https://entscheidsuche.ch/img/Ordner.png" width="20px"></a>'
      setzeInfoString(gesamt, 'Spider-' + spider, text, jobtyp, datum, zusatz, thist)
      for (const s of signaturen) {
        if ('signaturen' in data && s in data.signaturen) setzeInfoString(data.signaturen[s], s, text, jobtyp, datum, zusatz, thist)
        else {
          setzeInfoString({ gesamt: 0 }, s, text, jobtyp, datum, zusatz, thist)
        }
      }
    }

    function process (data, thist) {
      const spiders = {}
      let text = ''
      for (const kanton in data) {
        text += '<h2><svg id="Button-' + kanton + '" onclick="toggle(\'' + kanton + '\')" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="caret right fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-caret-right-fill b-icon bi"><g><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path></g></svg><img src="https://entscheidsuche.ch/img/' + kanton + '.png" width="20px"> <a href="/search?query=*&filter=h%40' + kanton + '&sort=date">' + data[kanton].de + '</a> <span id="' + kanton + '">0</span> (+<span id="' + kanton + '-new">0</span>) <span name="1900-01-01" id="' + kanton + '-date">???</span></h2>'
        text += '<dl id="Toggle-' + kanton + '" style="display:none">'
        for (const gericht in data[kanton].gerichte) {
          if (Object.keys(data[kanton].gerichte[gericht].kammern).length > 1) {
            text += '<dt><small><span id="' + gericht + '">0</span> (+<span id="' + gericht + '-new">0</span>)</small></dt><dd><svg id="Button-' + gericht + '" onclick="toggle(\'' + gericht + '\')" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="caret right fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-caret-right-fill b-icon bi"><g><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path></g></svg><a href="/search?query=*&filter=h%40' + gericht + '&sort=date">' + data[kanton].gerichte[gericht].de + '</a> <span name="1900-01-01" id="' + gericht + '-date">???</span>'
            text += '<dl id="Toggle-' + gericht + '" style="display:none">'
            for (const kammer in data[kanton].gerichte[gericht].kammern) {
              text += '<dt><small><span id="' + kammer + '">0</span> (+<span id="' + kammer + '-new">0</span>)</small></dt><dd><a href="/search?query=*&filter=h%40' + kammer + '&sort=date">' + data[kanton].gerichte[gericht].kammern[kammer].de + '</a> <span name="1900-01-01" id="' + kammer + '-date">???</span></dd>'
              const spider = data[kanton].gerichte[gericht].kammern[kammer].spider
              if (spider in spiders) spiders[spider].push(kammer)
              else spiders[spider] = [kammer]
            }
            text += '</dl>'
          } else {
            text += '<dt><small><span id="' + gericht + '">0</span> (+<span id="' + gericht + '-new">0</span>)</small></dt><dd><a href="/search?query=*&filter=h%40' + gericht + '&sort=date">' + data[kanton].gerichte[gericht].de + '</a> <span name="1900-01-01" id="' + gericht + '-date">???</span>'
            for (const kammer in data[kanton].gerichte[gericht].kammern) {
              const spider = data[kanton].gerichte[gericht].kammern[kammer].spider
              if (spider in spiders) spiders[spider].push(kammer)
              else spiders[spider] = [kammer]
            }
          }
          text += '</dd>'
        }
        text += '</dl>'
      }
      text += '<h1><svg id="Button-Spider" onclick="toggle(\'Spider\')" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="caret right fill" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-caret-right-fill b-icon bi"><g><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"></path></g></svg>Spider (' + Object.keys(spiders).length + ')</h1>'
      text += '<dl id="Toggle-Spider" style="display:none">'
      for (const spider in spiders) {
        text += '<dt><small><span id="Spider-' + spider + '">0</span> (+<span id="Spider-' + spider + '-new">0</span>)</small></dt><dd><a href="https://entscheidsuche.ch/docs/Index/' + spider + '/last" target="_blank">' + spider + '</a> <span name="1900-01-01" id="Spider-' + spider + '-date">???</span></dd>'
      }
      text += '</dl>'
      const inhalt = document.getElementById('inhalt')
      if (inhalt) inhalt.innerHTML = text
      // Nun die Werte holen
      for (const spider in spiders) {
        fetch('https://entscheidsuche.ch/docs/Index/' + spider + '/last')
          .then(response => response.json())
          .then(data => eintragen(data, spider, spiders[spider], thist))
      }
    }

    function holeInhalt (thist) {
      if (flag === 0) {
        flag = 1
        const head=document.getElementsByTagName('head')[0]
        const code = 'function toggle (elementid) { t=document.getElementById("Toggle-"+elementid); b=document.getElementById("Button-"+elementid); if (t.style.length === 0) { t.style="display:none"; b.style.transform = "rotate(0deg)"} else { t.style=""; b.style.transform = "rotate(90deg)"} }'
        const element = document.createElement('script')
        element.type = 'text/javascript'
        element.appendChild(document.createTextNode(code))
        head.appendChild(element)
        const url = 'https://entscheidsuche.ch/docs/Facetten.json'
        fetch(url).then(function (response) {
          response.json().then(function (content) {
            process(content, thist)
          })
        })
      }
    }
    holeInhalt(this)
  }
  public get locale () {
    return AppModule.locale
  }
}
</script>
