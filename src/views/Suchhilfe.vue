<template>
  <div id="organization">
    <template v-if="locale==='de'">
      <h1>Suchhilfe</h1>
      <p>Die Suche auf entscheidsuche.ch ist eine Volltextsuche, die mit Metadaten ergänzt werden kann. Im Suchfeld können Sie beliebige Suchbegriffe eingeben. Die Klein- und
         Grossschreibung spielt dabei keine Rolle.
      </p>
      <h2>Textsuche</h2>
      <h3>Trunkierung</h3>
      <p>Suchen Sie z.B. mit <i>Eigentümer</i>, so erhalten Sie nur Dokumente, in denen der Begriff so vorkommt. Dokumente, in denen <i>Eigentümerin</i> oder
         <i>Eigentümers</i> enthalten sind, werden nicht gefunden. Mit <i>Eigentümer*</i> werden jedoch alle Wörter gefunden, die so beginnen. Sie können dabei auch
         Linkstrunkieren, d.h. <i>*Eigentümer</i> findet auch Begriffe, wie z.B. <i>Grundeigentümer</i>. Auch eine kombiniert Links- und Rechtstrunkierung ist möglich:
         <i>*Eigentümer*</i>. Sie findet z.B. auch die <i>Grundeigentümerin</i>. Auch können einzelne Buchstaben durch einen Platzhalter ersetzt werden. So findet <i>?udex</i>
         sowohl <i>judex</i> als auch <i>iudex</i>.
      </p>
      <h3>Fuzzy-Suche</h3>
      <p>Begriffe können auch in ähnlicher Schreibweise gesucht werden. Dazu wird eine angefügte Tilde (<i>~</i>) verwendet. Dabei wird eine <a href="https://de.wikipedia.org/wiki/Levenshtein-Distanz">Levenshtein-Distanz</a>
         von 2 verwendet. So findet <i>Eigentümer~</i> auch <i>Eigentümerin</i>. Schwächere oder stärkere Abweichungen können mit <i>Eigentümer~1</i> oder <i>Eigentümer~3</i> gefunden werden.
         Die Fuzzy-Suche kann in einem Suchbegriff nicht mit der Trunkierung kombiniert werden.
      </p>
      <h3>Logische Verknüpfung</h3>
      <p>Wenn Sie mit zwei Suchbegriffen suchen, werden diese automatisch mit <i>AND</i> verknüpft. Das bedeutet, dass beide Begriffe gleichzeitig in der Suche enthalten sein müssen.
         Wenn Sie Dokumente finden möchten, in denen mindestens einer der Suchbegriffe enthalten ist, verwenden Sie die <i>OR</i>-Verknüpfung. Bei den Verknüpfungsoperatoren ist die
         Grossschreibweise wichtig, da sie sonst als normale Suchbegriffe gesucht werden. Sie können auch <i>AND</i> und <i>OR</i>-Operatoren verbinden. So findet
         <i>(Mord OR Totschlag) AND Alkohol</i> alle Dokumente, die <i>Mord</i> oder <i>Totschlag</i> sowie auch <i>Alkohol</i> enthalten. Dabei müssen jedoch <b>ZWINGEND</b> Klammern
         gesetzt werden. Ohne Klammern würde der Suchbegriff <i>Mord</i> ignoriert werden.
      </p>
      <p>Sie können auch nach allen Dokumenten suchen, die einen Begriff nicht enthalten. So findet <i>NOT Mord</i> alle Dokumente, in denen der Begriff <i>Mord</i> nicht vorkommt.
      </p>
      <h3>Phrasensuche</h3>
      <p>Sie können mit Anführungszeichen eine feste Wortfolge suchen. Mit <i>"droit des obligations"</i> finden Sie die Wörter genau in dieser Reihenfolge. Dies ist auch empfehlenswert
         für die Suche mit Geschäftsnummern: <i>"4C.296/2003"</i>.
      </p>
      <h3>Distanzsuche</h3>
      <p>Suchen Sie Begriffe, die im gleichen Kontext vorkommen, können Sie das mit der Distanzsuche finden: <i>"Enteignung Verkehrswert"~5</i> findet die beiden Begriffe im maximalen Abstand
         von 5 Wörtern.
      </p>
      <h2>Metadaten</h2>
      <p>Die Suche kann mit Metadaten kombiniert werden. Als Metadaten stehen Ihnen das Entscheiddatum (wenn dieses nicht vorhanden ist, wird das Publikationsdatum verwendet), der Kanton,
         das Gericht und teilweise auch die Kammer zur Verfügung.</p>
      <p>Den Datumsbereich können Sie mit dem Datumsschieber einschränken.</p>
      <p>Die Suche kann auf die eidgenössischen Gerichte oder verschieden Kantone eingeschränkt werden, in dem Sie diese Links anklicken. Diese können den Kanton expandieren und sehen dann
         die dort verfügbaren Gerichte und darunter teilweise auch die Kammern.</p>
      <p>Die Metadaten werden stets mit den aktuellen Suchbegriffen verknüpft. Sollten Sie nur mit Metadaten suchen wollen, geben Sie als Suchbegriff <i>*</i> ein.</p>
      <h2>Aktualisierungen</h2>
      <p>Unter <b-link href="status">Datenstand</b-link> finden Sie eine Übersicht unserer Quellen mit dem Datum des jeweils letzten Abgleichs.</p>
    </template>
  </div>
</template>

<style lang="scss">
#organization {
}
</style>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'

@Component({
  name: 'Organization'
})
export default class Organization extends Vue {
  public get locale () {
    return AppModule.locale
  }
}
</script>
